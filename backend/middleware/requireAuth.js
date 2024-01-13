require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return res.status(401).json({ error: 'Login required' });
    const token = authorization.split(' ')[1];
    // console.log(req.url, authorization, token);
    try {
        const { username } = jwt.verify(token, process.env.JWT_KEY);
        req.user = username;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Couldn\'t Authorize' });
    }
};