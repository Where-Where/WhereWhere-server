var express = require('express');
var router = express.Router();
const userProductController = require('../controllers/userProductController');
const upload = require('../modules/multer');

/**상품 등록 */
router.post('/singleimg', upload.single('photo'), userProductController.registerSingleImg);
router.post('/imgs', upload.array('photo'), userProductController.registerImgs);
router.post('/register', userProductController.register);

/**상품 삭제
 * 진짜 삭제가 아니라 like를 0에서 1로 바꾸기
 */

/**해당 카테고리의 상품 보여주기
 * like 0인 상품만
 */
router.get('/show/:categoryIdx', userProductController.showProductsByCategory);

module.exports = router;
