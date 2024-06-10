import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
// import { availableParallelism } from 'node:os';
// import cluster from 'node:cluster';
// import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import Message from './models/Message.js';
import User from './models/User.js';
import cors from 'cors';
import auth from './utils/auth.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
// import { start } from 'node:repl';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://chat-test-bquw.onrender.com',
];

async function startServer() {
  try {
    await connectToDatabase();
    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      },
      connectionStateRecovery: {},
      });

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

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
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }));
    
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      }
    });

    const upload = multer({ storage });

    app.post('/upload', upload.single('file'), (req, res) => {
      const file = req.file;
      if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      console.log('File object:', file);
    
      const filePath = file.path;
      console.log('File path to be uploaded:', filePath);
    
      cloudinary.uploader.upload(filePath, { use_filename: true, unique_filename: false }, (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ error: 'Error uploading to Cloudinary' });
        }
        res.json({
          filename: result.public_id,
          url: result.secure_url,
        });
    
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error('Error deleting file:', error)
          }
        });
      });
    });
    
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
    
    // API route for fetching messages
    app.get('/messages', async (req, res) => {
      try {
        const messages = await Message.find({}).populate('user').exec();
        res.json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Error fetching messages' });
      }
    });
    
    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
    
    io.on('connection', async (socket) => {
      console.log('a user connected');
    
      socket.on('chat message', async (message, callback) => {
        console.log('message: ', message);
        let newMessage;
        try {
          newMessage = new Message({
            content: message.content,
            client_offset: message.client_offset,
            user: {
              _id: message.user._id,
              username: message.user.username,
              profilePicture: message.user.profilePicture
            }
          });
          await newMessage.save();
          const populatedMessage = await newMessage.populate('user');
          io.emit('chat message', { 
            content: populatedMessage.content, 
            user: { 
              username: populatedMessage.user?.username, 
              profilePicture: populatedMessage.user?.profilePicture 
            }, 
            messageId: populatedMessage._id 
          });
          callback();
        } catch (error) {
          console.error('Error inserting message', error);
          if (error.code === 11000) {
            callback();
          } else {
            console.error('Error inserting message', error);
          }
        }
      });
    
      if (!socket.recovered) {
        try {
          const serverOffset = socket.handshake.auth.serverOffset || '000000000000000000000000';
          const messages = await Message.find({ _id: { $gte: serverOffset } }).populate('user').exec();
          messages.forEach((message) => {
            if (message.user) {
              socket.emit('chat message', { 
                content: message.content, 
                user: { 
                  username: message.user?.username, 
                  profilePicture: message.user?.profilePicture 
                }, 
                messageId: message._id 
              });
            } else {
              console.error('User not found for message:', message);
            }
          });
        } catch (error) {
          console.error('Error retrieving messages', error);
        }
      }
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    });
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server and sockets running at http://localhost:${PORT}`);
    });
    
    const updateUserStatusToOffline = async () => {
      try {
        await User.updateMany({ status: 'Online' }, { $set: { status: 'Offline' } });
      } catch (error) {
        console.error('Error updating user status to offline:', error);
      }
    };
    setInterval(updateUserStatusToOffline, 900000);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
