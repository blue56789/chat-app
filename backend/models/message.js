const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true
        },
        author: {
            type: String,
            ref: 'User',
            required: true
        },
        isDocument: {
            type: Boolean,
            required: true
        },
        fileName: {
            type: String
        },
        body: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

module.exports = mongoose.model('Message', messageSchema);