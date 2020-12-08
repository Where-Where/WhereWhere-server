var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const upload = require('../modules/multer');
//router.post('/imgs', authMiddleware.checkToken, upload.array('photo'), productController.registerDummyImgs);

/**더미데이터 */
//router.post('/register', authMiddleware.checkToken, productController.register);
//router.post('/imgupload', authMiddleware.checkToken, upload.array('photo'), productController.uploadImg);


/**상품 삭제
 * 진짜 삭제가 아니라 like를 0에서 1로 바꾸기
 */


/**해당 카테고리의 상품 보여주기
 * like 0인 상품만
 */
router.post('/facebook', authMiddleware.checkToken, upload.single('photo'), productController.facebookRegister);
router.post('/instagram', authMiddleware.checkToken, upload.single('photo'), productController.instagramRegister);
//router.post('/image', authMiddleware.checkToken, upload.single('photo'), productController.registerImage);

router.get('/show', authMiddleware.checkToken, productController.showAllById);
router.get('/show/:mainCategorIdx', authMiddleware.checkToken, productController.showByMainCategory);
router.get('/show/:subCategoryIdx', authMiddleware.checkToken, productController.showBySubCategory);

module.exports = router;
