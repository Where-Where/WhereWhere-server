var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

const ffmpegController = require('../controllers/ffmpegController');
router.post('/video', ffmpegController.createFragmentPreview);
//😈const upload = require('../modules/multer');

/**상품 등록 */
//router.post('/singleimg', upload.single('photo'), productController.registerSingleImg);
// array로 통일하고 사진 하나면 그냥 하나만 보내도록.
//router.post('/imgs', upload.array('photo'), productController.registerImgs);

/**더미데이터 */
router.post('/register', productController.register);
router.get('/showall', productController.showAll);

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
router.get('/show/:subCategoryIdx', productController.showProductsBySubCategory);

module.exports = router;
