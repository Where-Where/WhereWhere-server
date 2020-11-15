const express = require('express');
const userModel = require('../models/userModel');
const googleInfo = require('../config/googleInfo.json');
const {OAuth2Client} = require('google-auth-library');

module.exports = {
    googleSignIn: async(req, res)=>{
        const token = req.body.id_token;//맞는 형식인지 확인
        const CLIENT_ID = googleInfo.CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);
        const verify = async ()=>{
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            /**
             * userid가 뭔지 찍어보기..
             */
            const userid = payload['sub'];
            console.log('userid : ', userid);
        }
        try{
            await verify();
            
        }catch(err){
            console.log('google signIn verify ERROR : ', err);
        }
    },
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