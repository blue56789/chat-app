const router = require('express').Router();
const { login, signup, getUsers } = require('../controllers/user');
const requireAuth = require('../middleware/requireAuth');

router.get('/', requireAuth, getUsers);
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;