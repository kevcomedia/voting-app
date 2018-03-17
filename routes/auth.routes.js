const express = require('express');
const bodyParser = require('body-parser');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({extended: false}));

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

module.exports = authRouter;
