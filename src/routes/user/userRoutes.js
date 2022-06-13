const express = require('express');
const router = express.Router();
router.use(express.json());

const { index, login, createAccount } = require('../../controllers/user.js');

// router.get('/', index)
router.post('/api/login', login);
router.post('/api/createAccount', createAccount)

module.exports = router;
