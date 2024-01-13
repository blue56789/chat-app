const { addConvo, getAllConvos } = require('../controllers/conversation');
const { getAllMessages } = require('../controllers/message');
const { getAllUsers, signup, getUsers } = require('../controllers/user');

const router = require('express').Router()

router.route('/user')
    .post(signup)
    .get(getUsers);

router.route('/convo')
    .get(getAllConvos)
    .post(addConvo);

router.get('/msg', getAllMessages);

module.exports = router;