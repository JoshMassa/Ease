import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import Message from './models/Message.js';
import cors from 'cors';
import auth from './utils/auth.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

dotenv.config();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://chat-test-bquw.onrender.com',
];

async function main() {
    try {
        await connectToDatabase();
        startServer();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

async function startServer() {
    if (cluster.isPrimary) {
        const numCPUs = availableParallelism();
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork({
                PORT: 3000 + i
            });
        }
        setupPrimary();
    } else {
        const app = express();
        const server = createServer(app);
        const io = new Server(server, {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true
            },
            connectionStateRecovery: {},
            adapter: createAdapter()
        });

        const __dirname = dirname(fileURLToPath(import.meta.url));

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        
        app.use(cors({
            origin: (origin, callback) => {
                if (allowedOrigins.includes(origin) || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST'],
            credentials: true
        }));
        
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => {
                const token = req.headers.authorization || '';
                return { token };
            },
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
        });
        
        await apolloServer.start();
        
        app.use('/graphql', expressMiddleware(apolloServer, { context: auth.authMiddleware }));

        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });

        io.on('connection', async (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('chat message', async (msg, clientOffset, callback) => {
                console.log('message: ' + msg);
                let message;
                try {
                    message = new Message({ content: msg, client_offset: clientOffset });
                    await message.save();
                } catch (error) {
                    if (error.code === 11000) {
                        callback();
                    } else {
                        console.error('Error inserting message', error);
                    }
                    return;
                }
                io.emit('chat message', msg, message._id);
                callback();
            });

            if (!socket.recovered) {
                try {
                    const serverOffset = socket.handshake.auth.serverOffset || '000000000000000000000000';
                    const messages = await Message.find({ _id: { $gte: serverOffset } }).exec();
                    messages.forEach((message) => {
                        socket.emit('chat message', message.content, message._id);
                    });
                } catch (error) {
                    console.error('Error retrieving messages', error);
                }
            }
        });

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server and sockets running at http://localhost:${PORT}`);
        });
    }
}

main();
