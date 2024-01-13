const router = require('express').Router();
const { getConvos, addConvo, delConvo } = require('../controllers/conversation');
const { addGroup, editGroup, delGroup } = require('../controllers/group');
const { sendMessage, getMessages } = require('../controllers/message');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);
router.route('/convos')
    .get(getConvos)
    .post(addConvo)
    .delete(delConvo);

router.post('/msg', sendMessage);
router.get('/msg/:convo', getMessages);

router.route('/group')
    .post(addGroup)
    .put(editGroup)
    .delete(delGroup);

module.exports = router;