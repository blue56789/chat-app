const Message = require('../models/message');
const Conversation = require('../models/conversation');

const sendMessage = async (req, res) => {
    const { isDocument, convo, msg, fileName } = req.body;
    const user = req.user;
    try {
        const conv = await Conversation.findById(convo);
        if (!conv)
            throw new Error('Conversation doesn\'t exist');
        if (!conv.users.includes(user))
            throw new Error('You are not a part of this conversation');
        const message = await Message.create({ conversation: convo, author: user, isDocument: isDocument, body: msg, fileName: fileName });
        await Conversation.findByIdAndUpdate(convo, { lastMessage: message._id });
        return res.json(message);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { convo } = req.params;
    try {
        const messages = await Message.find({ conversation: convo }).sort({ createdAt: 1 });
        return res.json(messages);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { sendMessage, getMessages };