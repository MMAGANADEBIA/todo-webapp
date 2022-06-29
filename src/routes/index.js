//import requiered modules and set a route
const express = require('express');
const user = require('./user/userRoutes.js');
const router = express.Router();
router.use(express.json());
router.use('/', user);
module.exports = router;
