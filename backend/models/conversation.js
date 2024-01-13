const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        isGroupChat: {
            type: Boolean,
            required: true,
            default: false
        },
        users: {
            type: [{
                type: String,
                ref: 'User',
            }],
            required: true,
            default: []
        },
        name: String,
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },
        admin: {
            type: String,
            ref: 'User'
        }
    }
);

module.exports = mongoose.model('Conversation', conversationSchema);