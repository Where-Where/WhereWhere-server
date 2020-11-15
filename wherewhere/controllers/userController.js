const express = require('express');
const userModel = require('../models/userModel');

module.exports = {
    createUser: async(req, res)=>{
        try{
            //const {userIdx, sns_category, token, refresh_token, signup_date} = req.body;
            //const user = await userModel.createUser(userIdx, sns_category, token, refresh_token, signup_date);
            const result = await userModel.createUser(req.body);
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    },
    deleteUser: async(req, res)=>{
        try{
            const userIdx = req.body.userIdx;
            const result = await userModel.deleteUser(userIdx);
            /**
             * 해당 userIdx가 저장한 product도 다 지워야함.
             * productModel에 deleteProductByUser(userIdx)를 새로 만들어서
             * 같이 실행하는게 좋을 듯.
             */
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    }
}