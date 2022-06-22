const express = require('express');
const router = express.Router();
router.use(express.json());

const { login, createAccount, addTask, getTasks, deleteTasks } = require('../../controllers/user.js');

router.post('/api/login', login);
router.post('/api/createAccount', createAccount);
router.post('/api/addTask', addTask);
router.post('/api/deleteTasks', deleteTasks);

router.get('/api/getTasks', getTasks);

module.exports = router;
