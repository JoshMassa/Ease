import Message from '../models/Message.js';

const resolvers = {
    Query: {
        messages: async () => {
            try {
                return await Message.find();
            } catch (error) {
                throw new Error('Error fetching messages');
            }
        },
    },
    Mutation: {
        addMessage: async (_, { content, client_offset }) => {
            try {
                const message = new Message({ content, client_offset });
                await message.save();
                return message;
            } catch (error) {
                throw new Error('Error adding message');
            }
        },
    },
};

export default resolvers;