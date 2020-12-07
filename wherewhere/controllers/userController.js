//const express = require('express');
const userModel = require('../models/userModel');
//const signInModel = require('../models/signinModel');
const jwt = require('../modules/jwt');
const admin = require('firebase-admin');
const serviceAccount = require('../config/wherewhere-1b2ed-firebase-adminsdk-wvlc0-56b02093ac.json');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wherewhere-1b2ed.firebaseio.com"
});

module.exports = {
    googleSignIn: async(req, res)=>{
        try{
            const idToken = req.body.idToken;
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            //console.log('decodedToken : ', decodedToken);
            let uid = decodedToken.uid;
            //console.log('uid : ', uid);
            //const result = await userModel.findByUid(uid);
            const userByUid = await userModel.findByUid(uid).exec();
            console.log('userByUid : ', userByUid);
            if(userByUid === null){
                /**없는 사용자 -> 회원가입 시키기 */
                const newUser = await userModel.createUser({
                    "sns_category":"google",
                    "uid": uid
                });
                console.log("구글 - 새로 회원가입한 사용자")
                const {token, _} = await jwt.sign(newUser);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                    token : token
                }));
            }else{
                /**있는 사용자 -> 그냥 로그인 */
                console.log("구글 - 기존에 있던 사용자");
                const {token, _} = await jwt.sign(userByUid);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                    token: token
                }))
            }
        }catch(err){
            console.log('google signIn error : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(status.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    facebookSignIn: async(req, res)=>{
        try{
            const idToken = req.body.idToken;
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            //console.log('decodedToken : ', decodedToken);
            let uid = decodedToken.uid;
            //console.log('uid : ', uid);
            //const result = await userModel.findByUid(uid);
            const userByUid = await userModel.findByUid(uid).exec();
            console.log('userByUid : ', userByUid);
            if(userByUid === null){
                /**없는 사용자 -> 회원가입 시키기 */
                const newUser = await userModel.createUser({
                    "sns_category":"facebook",
                    "uid": uid
                });
                console.log("페이스북 - 새로 회원가입한 사용자")
                const {token, _} = await jwt.sign(newUser);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                    token : token
                }));
            }else{
                /**있는 사용자 -> 그냥 로그인 */
                console.log("페이스북 - 기존에 있던 사용자");
                const {token, _} = await jwt.sign(userByUid);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                    token: token
                }))
            }
        }catch(err){
            console.log('facebook signIn error : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(status.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    appleSignIn: async(req, res)=>{
        try{
            const idToken = req.body.idToken;
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            //console.log('decodedToken : ', decodedToken);
            let uid = decodedToken.uid;
            //console.log('uid : ', uid);
            //const result = await userModel.findByUid(uid);
            const userByUid = await userModel.findByUid(uid).exec();
            console.log('userByUid : ', userByUid);
            if(userByUid === null){
                /**없는 사용자 -> 회원가입 시키기 */
                const newUser = await userModel.createUser({
                    "sns_category":"apple",
                    "uid": uid
                });
                console.log("애플 - 새로 회원가입한 사용자")
                const {token, _} = await jwt.sign(newUser);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                    token : token
                }));
            }else{
                /**있는 사용자 -> 그냥 로그인 */
                console.log("애플 - 기존에 있던 사용자");
                const {token, _} = await jwt.sign(userByUid);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {
                    token: token
                }))
            }
        }catch(err){
            console.log('apple signIn error : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(status.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    /**더미데이터를 위한 임시 컨트롤러 */
    createUser: async(req, res)=>{
        try{
            //const {userIdx, sns_category, token, refresh_token, signup_date} = req.body;
            //const user = await userModel.createUser(userIdx, sns_category, token, refresh_token, signup_date);
            const result = await userModel.createUser(req.body);
            console.log('create user result : ', result);
            const {token, _} = await jwt.sign(result);
            console.log("token : ", token);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {
                token : token
            }));
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