var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();

/**
 * 콜백 url에 맞게 수정해야 할 듯.
 */
router.post('/google', userController.googleSignIn);

router.post('/facebook', userController.facebookSignIn);

router.post('/apple', userController.appleSignIn);


/**회원 탈퇴 */
router.delete('/delete', userController.deleteUser);

module.exports = router;
