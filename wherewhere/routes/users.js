var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();

/**apple, facebook, google 나눠서 api 3개 만들어야 함. */
router.post('/signup', userController.createUser);

/**회원 탈퇴 */
router.delete('/delete', userController.deleteUser);

module.exports = router;
