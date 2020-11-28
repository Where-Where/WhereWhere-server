const productModel = require('../models/productModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const sendMessage = require('../modules/sendMessage');
const util = require('../modules/util');

module.exports = {
    register: async(req, res)=>{
        try{
            const _id = req.decoded._id;
            const {
                siteUrl, dataUrl, resizedDataUrl, title, description, plural
            } = req.body;
            const result = await productModel.register({
                siteUrl: siteUrl,
                dataUrl: dataUrl,
                resizedDataUrl: resizedDataUrl,
                title: title,
                description: description,
                plural: plural,
                userIdx: _id
            });
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    },
    registerImgs: async(req, res)=>{
        const {userIdx, productIdx} = req.body;
        /**
         * multer를 쓰면서 다른 정보도 body로 받아올 수 있나?
         */
        let imageLocations = [];
        for(var i=0; i<req.files.length; i++){
            imageLocations[i]=req.files[i].location;
        }
        /**
         * db에 넣으면 됨.
         * model의 파라미터 중 img에 imageLocations를 넣고
         * 나머지는 다 따로따로 넣어줘야할듯..?
         * const result = await productModel.registerImgs(userIdx, productIdx, imageLocations);
         */
    },
    //홈 카테고리
    showAllById: async(req, res)=>{
        const _id = req.decoded._id;
        try{
            const result = await productModel.showAllById(_id).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_MAIN, result));
        }catch(err){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showByMainCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const mainCategoryIdx = req.params.mainCategoryIdx;
        try{
            const result = await productModel.showByMainCategory(_id, mainCategoryIdx).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_MAIN, result));
        }catch(err){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showBySubCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const subCategoryIdx = req.params.subCategoryIdx;
        try{
            const result = await productModel.showProductsBySubCategory(_id, subCategoryIdx).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_SUB, result));
        }catch(err){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}