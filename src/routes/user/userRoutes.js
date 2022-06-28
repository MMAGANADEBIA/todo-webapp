const express = require('express');
const router = express.Router();
router.use(express.json());

const { login,
  createAccount,
  addTask,
  getTasks,
  deleteTasks,
  updateTask,
  getUser,
  updateAccount,
  deleteAccount
} = require('../../controllers/user.js');

router.post('/api/login', login);
router.post('/api/createAccount', createAccount);
router.post('/api/addTask', addTask);
router.post('/api/deleteTasks', deleteTasks);
router.post('/api/updateTask', updateTask)
router.post('/api/updateAccount', updateAccount);
router.post('/api/deleteAccount', deleteAccount);

router.get('/api/getTasks', getTasks);
router.get('/api/getUser', getUser);

module.exports = router;
