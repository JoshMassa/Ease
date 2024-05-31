import Message from "../models/Message.js";
import User from "../models/User.js";
import auth from '../utils/auth.js'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';

const resolvers = {
  Query: {
    messages: async () => {
      try {
        return await Message.find();
      } catch (error) {
        throw new Error("Error fetching messages");
      }
    },
    // fetch one user
    user: async (_, { id }) => {
      return await User.findById(id);
    },
    // fetch all users
    users: async () => {
      return await User.find({});
    },
  },
  Mutation: {
    addMessage: async (_, { content, client_offset }) => {
      try {
        const message = new Message({ content, client_offset });
        await message.save();
        return message;
      } catch (error) {
        throw new Error("Error adding message");
      }
    },
    // User mutations
    signup: async (_, { username, email, password }) => {
      const userExists = await User.findOne({ email });
      const usernameExists = await User.findOne({ username });

      if (userExists) {
        throw new Error("User already exists");
      }

      if (usernameExists) {
        throw new Error("Username is already taken");
      }

      const user = await User.create({
        username,
        email,
        password,
      });
      
      const token = auth.signToken(user);

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = auth.signToken(user);
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          token,
        };
      } else {
        throw new Error("Invalid email or password");
      }
    },
  },
};

export default resolvers;
