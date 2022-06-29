//necessary modules
const express = require('express');
const router = express.Router();
router.use(express.json());

//Modules from controllers
const { login,
  createAccount,
  addTask,
  getTasks,
  deleteTasks,
  updateTask,
  getUser,
  updateAccount,
  deleteAccount,
  exitSession
} = require('../../controllers/user.js');

//post data to controllers for users and tasks
router.post('/api/login', login);
router.post('/api/createAccount', createAccount);
router.post('/api/addTask', addTask);
router.post('/api/deleteTasks', deleteTasks);
router.post('/api/updateTask', updateTask)
router.post('/api/updateAccount', updateAccount);
router.post('/api/deleteAccount', deleteAccount);

//get data from controllers to user and tasks information
router.get('/api/getTasks', getTasks);
router.get('/api/getUser', getUser);
//simple get for a module to reset the session data
router.get('/api/exitSession', exitSession)

//export the router module
module.exports = router;
