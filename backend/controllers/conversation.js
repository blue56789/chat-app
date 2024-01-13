const Conversation = require('../models/conversation');
const Message = require('../models/message');

const addConvo = async (req, res) => {
    const { user } = req.body;
    const username = req.user;
    try {
        if (!user)
            throw new Error('Can\'t create conversation');
        const exists = await Conversation.findOne({
            isGroupChat: false,
            users: { $all: [username, user] }
        });
        if (exists)
            throw new Error('Conversation already exists');
        const convo = await Conversation.create({
            isGroupChat: false,
            users: [username, user]
        });
        res.json(convo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const delConvo = async (req, res) => {
    const { id } = req.body;
    const username = req.user;
    try {
        const convo = await Conversation.findById(id);
        if (convo.isGroupChat || (convo.users[0] != username && convo.users[1] != username))
            throw new Error('Can\'t delete conversation');
        const deleted = await Conversation.findByIdAndDelete(id);
        await Message.deleteMany({ conversation: id });
        res.json(deleted);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getConvos = async (req, res) => {
    const user = req.user;
    try {
        const convos = await Conversation.find({
            users: { $all: [user] }
        }).populate('lastMessage');
        return res.json(convos);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getAllConvos = async (req, res) => {
    try {
        const convos = await Conversation.find();
        res.json(convos);
    } catch (error) {
        res.status(400).json(convos);
    }
};

module.exports = { addConvo, getConvos, getAllConvos, delConvo };