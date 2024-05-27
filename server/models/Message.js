import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: String,
    client_offset: {
        type: Number,
        unique: true,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;