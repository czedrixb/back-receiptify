const express = require("express")
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/login', authController.login);
router.get('/callback', authController.callback);
router.get('/receipt', authController.receipt);
router.get('/refresh', authController.refresh);

module.exports = router