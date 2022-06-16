const express = require('express');
const router = express.Router();
router.use(express.json());

const { index, login, createAccount, addTask } = require('../../controllers/user.js');

// router.get('/', index)
router.post('/api/login', login);
router.post('/api/createAccount', createAccount)
router.post('/api/addTask', addTask)

module.exports = router;
