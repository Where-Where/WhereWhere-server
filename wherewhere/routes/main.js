var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

//const ffmpegController = require('../controllers/ffmpegController');
//router.post('/video', ffmpegController.createFragmentPreview);
const upload = require('../modules/multer');
//router.post('/imgs', authMiddleware.checkToken, upload.array('photo'), productController.registerDummyImgs);

/**더미데이터 */
router.post('/register', authMiddleware.checkToken, productController.register);


/**
 * userIdx, product 글 정보, product 이미지 정보를 다 보내면
 * 첫 번째 미들웨어 : product 이미지 정보만 분리해서 multer
 * 두 번째 미들웨어 : multer -> s3에 저장
 * 컨트롤러 : s3에 저장한 이미지 url과 userIdx, product 글 정보 합치기
 */
//😈router.post('/register', upload.array('photo'), productController.register);

/**상품 삭제
 * 진짜 삭제가 아니라 like를 0에서 1로 바꾸기
 */


/**해당 카테고리의 상품 보여주기
 * like 0인 상품만
 */
router.get('/show', authMiddleware.checkToken, productController.showAllById);
router.get('/show/:mainCategorIdx', authMiddleware.checkToken, productController.showByMainCategory);
router.get('/show/:subCategoryIdx', authMiddleware.checkToken, productController.showBySubCategory);

module.exports = router;
