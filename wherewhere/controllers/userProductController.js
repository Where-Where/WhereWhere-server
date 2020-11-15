const express = require('express');
const userProductModel = require('../models/userProductModel');

module.exports = {
    register: async(req, res)=>{
        try{
            const result = await userProductModel.register(req.body);
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    },
    showProductsByCategory: async(req, res)=>{
        const categoryIdx = req.params.categoryIdx;
        const userIdx = req.body.userIdx;/**이거 맞나 */
        /**
         * 카테고리별로 해당 사용자의 상품 다 보여주기
         * 코드 수정해야 함.
         */
        try{
            const result = await userProductModel.showProductsByCategory(userIdx, categoryIdx);
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    },
    registerSingleImg: async(req, res)=>{

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
         * const result = await userProductModel.registerImgs(userIdx, productIdx, imageLocations);
         */
    }
}