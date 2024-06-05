import Message from "../models/Message.js";
import User from "../models/User.js";
import auth from '../utils/auth.js';
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
      const user = await User.findById(id);
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
      };
    },
    // fetch all users
    users: async () => {
      const users = await User.find({});
      return users.map(user => ({
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
      }));
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
    updateUser: async (_, { id, input }) => {
      try {
        const user = await User.findByIdAndUpdate(id, input, { new: true, runValidators: true });
        return user;
      } catch (error) {
        throw new Error('Error updating user');
      }
    },
  },
};

export default resolvers;
