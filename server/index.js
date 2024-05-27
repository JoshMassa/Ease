import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { MongoClient, ObjectId } from 'mongodb';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = 'chatApp';
let db;
let messagesCollection;

async function main() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');

        db = client.db(dbName);
        messagesCollection = db.collection('messages');

        await messagesCollection.createIndex({ client_offset: 1 }, { unique: true });

        startServer();
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit the process with an error code
    }
}

function startServer() {
    if (cluster.isPrimary) {
        const numCPUs = availableParallelism();
        // create one worker per available core
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork({
                PORT: 3000 + i
            });
        }

        // set up the adapter on the primary thread
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
        })

        app.get('/', (req, res) => {
            res.sendFile(join(__dirname, 'index.html'));
        });

        io.on('connection', async (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            socket.on('chat message', async (msg, clientOffset, callback) => {
                console.log('message: ' + msg);
                let result;
                try {
                    result = await messagesCollection.insertOne({ content: msg, client_offset: clientOffset });
                } catch (e) {
                    if (e.code === 11000) {
                        callback();
                    } else {
                        console.error('Error inserting message', e);
                    }
                    return;
                }
                io.emit('chat message', msg, result.insertedId);
                callback();
            });

            if (!socket.recovered) {
                try {
                    const serverOffset = socket.handshake.auth.serverOffset || '000000000000000000000000';
                    const messages = await messagesCollection.find({ _id: { $gt: new ObjectId(serverOffset) } }).toArray();
                    messages.forEach((message) => {
                        socket.emit('chat message', message.content, message._id);
                    });
                } catch (e) {
                    console.error('Error retrieving messages', e);
                }
            }
        });

        server.listen(process.env.PORT || 3000, () => {
            console.log(`server running at http://localhost:${process.env.PORT || 3000}`);
        });
    }
}

main();
