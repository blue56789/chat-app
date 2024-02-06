require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const createToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_KEY, { expiresIn: '24h' });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password);
    try {
        if (!username || !password)
            throw new Error('Please fill all fields');
        const user = await User.login(username.trim(), password.trim());
        const token = createToken(username);
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username.match(/^[a-z\d_]{3,16}$/))
            throw new Error('Username must be between 3 and 16 characters long and should only contain lowercase letters, numbers, and underscores');
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,16}$/))
            throw new Error('Password must be between 8 and 16 characters long and should contain atleast one lowercase character, one uppercase character, one digit, and one special character ( !@#$%^&*() )');
        const user = await User.signup(username.trim(), password.trim());
        const token = createToken(username);
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getUsers = async (req, res) => {
    const search = req.query.search;
    try {
        if (!search)
            throw new Error('Please provide search query');
        const users = await User.find({
            $and: [
                { username: { $regex: search, $options: 'i' } },
                { username: { $ne: req.user } }
            ]
        }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { login, signup, getUsers };