import Message from "../models/Message.js";
import User from "../models/User.js";
import auth from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

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
      const user = await User.findById(id).populate('friends');
      if (!user) {
        throw new Error('No user found with that ID');
      }
      const messageCount = await Message.countDocuments({ user: id });
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        friends: user.friends,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
        country: user.country,
        aboutMe: user.aboutMe,
        profilePicture: user.profilePicture,
        university: user.university,
        major: user.major,
        title: user.title,
        company: user.company,
        status: user.status,
        messageCount,
      };
    },
    // fetch all users
    users: async () => {
      const users = await User.find({}).populate('friends');
      return users.map(async user => {
        const messageCount = await Message.countDocuments({ user: user._id });      
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          friends: user.friends,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          state: user.state,
          country: user.country,
          aboutMe: user.aboutMe,
          profilePicture: user.profilePicture,
          university: user.university,
          major: user.major,
          title: user.title,
          company: user.company,
          status: user.status,
          messageCount,
        };
      });
    },
    getUserByUsername: async (parent, { username }) => {
      const user = await User.findOne({ username }).populate('friends');
      if (!user) {
        throw new Error('No user found with that username');
      }
      const messageCount = await Message.countDocuments({ user: user._id });
      const filteredFriends = user.friends.filter(friend => friend && friend.username);
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        friends: filteredFriends,
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        state: user.state,
        country: user.country,
        aboutMe: user.aboutMe,
        profilePicture: user.profilePicture,
        university: user.university,
        major: user.major,
        title: user.title,
        company: user.company,
        status: user.status,
        messageCount,
      }
    },
    usersByStatus: async (_, { status }) => {
      try {
        return await User.find({ status });
      } catch (error) {
        throw new Error('Error fetching users by status');
      }
    },
  },
  Mutation: {
    addMessage: async (_, { content, client_offset }, { token }) => {
      try {
        const { _id } = auth.getProfile(token); // Get user ID from token
        const user = await User.findById(_id); // Find user by ID
        if (!user) throw new Error('User not found');

        const message = new Message({ content, client_offset, user: _id });
        await message.save();
        return message;
      } catch (error) {
        throw new Error("Error adding message");
      }
    },
    // User mutations
    addFriend: async (_, { userId, friendId }) => {
      if (userId === friendId) {
        throw new Error("You can't add yourself as a friend");
      }

      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { friends: friendId } },
          { new: true, runValidators: true }
        ).populate('friends');

        if (!user) {
          throw new Error('No user found with that ID');
        }

        const friend = await User.findByIdAndUpdate(
          friendId,
          { $addToSet: { friends: userId } },
          { new: true, runValidators: true }
        );

        if (!friend) {
          throw new Error('No friend found with that ID');
        }

        return user;
      } catch (error) {
        throw new Error('Error adding friend');
      }
    },
    removeFriend: async (_, { userId, friendId }) => {
      if (userId === friendId) {
        throw new Error('Users cannot remove themselves as a friend');
      }

      try {
        const userUpdate = await User.findByIdAndUpdate(
          userId,
          { $pull: { friends: friendId } },
          { new: true }
        );

        if (!userUpdate) {
          throw new Error('No user found with that ID');
        }

        const friendUpdate = await User.findByIdAndUpdate(
          friendId,
          { $pull: { friends: userId } },
          { new: true }
        );

        if (!friendUpdate) {
          throw new Error('No friend found with that ID');
        }

        return userUpdate;
      } catch (error) {
        throw new Error('Failed to remove friend');
      }
    },
    signup: async (_, { username, email, password }, context) => {
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
        token,
        user,
      };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPw = await bcrypt.compare(password, user.password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = auth.signToken({
        username: user.username,
        email: user.email,
        _id: user._id,
        profilePicture: user.profilePicture,
      });

      user.status = 'Online';
      await user.save();
      console.log('User status updated to Online for user:', user.username);

      return {
        token,
        user,
      };
    },
    updateUserStatus: async (_, { status }, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { status },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (_, { id, input }) => {
      try {
        const user = await User.findByIdAndUpdate(id, input, { new: true, runValidators: true });
        return user;
      } catch (error) {
        throw new Error('Error updating user');
      }
    },
    logout: async (_, __, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(
          context.user._id,
          { status: 'Offline' },
          { new: true }
        );
      }
      throw new AuthenticationError('Not logged in');
    }
  },
};

export default resolvers;