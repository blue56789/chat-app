const Conversation = require('../models/conversation');
const Message = require('../models/message');

const addGroup = async (req, res) => {
    const { users, name } = req.body;
    const username = req.user;
    try {
        if (!users || !name)
            throw new Error('Please provide name and users');
        const group = await Conversation.create({
            isGroupChat: true,
            users: [username, ...users],
            name,
            admin: username
        });
        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const editGroup = async (req, res) => {
    const { addUsers, delUsers, name, id } = req.body;
    const username = req.user;
    try {
        let group = await Conversation.findById(id);
        if (!group || !group.isGroupChat)
            throw new Error('Group doesnt exist');
        if (group.admin != username)
            throw new Error('Unauthorized');


        if (addUsers)
            group = await Conversation.findByIdAndUpdate(id, { $addToSet: { users: { $each: addUsers } } }, { new: true });
        if (delUsers)
            group = await Conversation.findByIdAndUpdate(id, { $pullAll: { users: delUsers } }, { new: true });
        if (name)
            group = await Conversation.findByIdAndUpdate(id, { name: name }, { new: true });

        res.json(await group.populate('lastMessage'));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const delGroup = async (req, res) => {
    const { id } = req.body;
    const username = req.user;
    try {
        const group = await Conversation.findById(id);
        if (username != group.admin)
            throw new Error('Can\'t delete group');
        const deleted = await Conversation.findByIdAndDelete(id);
        await Message.deleteMany({ conversation: id });
        res.json(deleted);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { addGroup, editGroup, delGroup };