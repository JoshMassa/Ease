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

dotenv.config();

async function main() {
    await connectToDatabase();
    startServer();
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
            connectionStateRecovery: {},
            adapter: createAdapter()
        });

        const __dirname = dirname(fileURLToPath(import.meta.url));

        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });

        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
        });

        await apolloServer.start();
        app.use('/graphql', expressMiddleware(apolloServer));

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
            console.log(`sockets running at http://localhost:${PORT}`);
        });
    }
}

main();
