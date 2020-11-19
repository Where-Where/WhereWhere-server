var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();

//더미데이터 집어넣기용 api
router.post('/create', userController.createUser);


router.post('/google', userController.googleSignIn);

router.post('/facebook', userController.facebookSignIn);

router.post('/apple', userController.appleSignIn);


/**회원 탈퇴 */
router.delete('/delete', userController.deleteUser);

module.exports = router;
