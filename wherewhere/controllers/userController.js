const express = require('express');
const userModel = require('../models/userModel');
const signInModel = require('../models/signinModel');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const serviceAccount = require('../config/wherewhere-1b2ed-firebase-adminsdk-wvlc0-56b02093ac.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wherewhere-1b2ed.firebaseio.com"
});

module.exports = {
    googleSignIn: async(req, res)=>{
        try{
            //더미데이터용
            const uid = req.body.uid;
            //여기 싹 다 주석 풀기(위에 uid 지우기)
            //const idToken = req.body.idToken;
            //const decodedToken = await admin.auth().verifyIdToken(idToken);
            //console.log('decodedToken : ', decodedToken);
            //let uid = decodedToken.uid;
            //console.log('uid : ', uid);
            //const result = await userModel.findByUid(uid);
            const userByUid = await userModel.findByUid(uid).exec();
            console.log('userByUid : ', userByUid);
            if(userByUid === null){
                /**없는 사용자 -> 회원가입 시키기 */
                const newUser = await userModel.createUser({
                    "sns_category":"google",
                    "uid": uid,
                    //"refresh_token": refreshToken,
                });
                console.log('new user : ', newUser);
                res.send(newUser);
            }else{
                /**있는 사용자 -> 그냥 로그인 */
                console.log("구글 - 기존에 있던 사용자");
                res.send(userByUid);
            }
        }catch(err){
            console.log('google signIn error : ', err);
            return res.send('google signIn error');
        }
    },
    facebookSignIn: async(req, res)=>{
        try{
            const idToken = req.body.idToken;
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log('decodedToken : ', decodedToken);
            let uid = decodedToken.uid;
            console.log('uid : ', uid);
            
            const userByUid = await userModel.findByUid(uid).exec();
            console.log('userByUid : ', userByUid);
            if(userByUid === null){
                /**없는 사용자 -> 회원가입 시키기 */
                const newUser = await userModel.createUser({
                    "sns_category":"facebook",
                    "uid": uid,
                    //"refresh_token": refreshToken,
                });
                console.log('new user : ', newUser);
                res.send(newUser);
            }else{
                /**있는 사용자 -> 그냥 로그인 */
                console.log("페이스북 - 기존에 있던 사용자");
                res.send(userByUid);
            }
        }catch(err){
            console.log('facebook signIn error : ', err);
            return res.send('facebook signIn error');
        }
    },
    appleSignIn: async(req, res)=>{
        const { provider, response } = req.body;
        if(provider === 'apple'){
            const { identityToken, user } = response.response;
            const json = jwt.decode(identityToken, { complete: true});
            const kid = json.header.kid;
            const appleKey = await signInModel.getAppleSignInKeys(kid)
            if(!appleKey){
                console.error('apple sign in error');
                return// 비정상 종료
            }
            const payload = await signInModel.verifyJWT(identityToken, appleKey);
            if(!payload){
                console.error('payload error');
                return;
            }
            console.log('payload : ', payload);
            /**
             * payload 형태
             * {
                    "iss": "https://appleid.apple.com",
                    "aud": "com.sarunw.siwa",
                    "exp": 1577943613,
                    "iat": 1577943013,
                    "sub": "xxx.yyy.zzz",
                    "nonce": "nounce",
                    "c_hash": "xxxx",
                    "email": "xxxx@privaterelay.appleid.com",
                    "email_verified": "true",
                    "is_private_email": "true",
                    "auth_time": 1577943013
                }
             */
            // 마지막으로 확인
            if(payload.sub === user && payload.aud === 'package Name'){
                //correct user
                //user is legit  and completely valid 
            }
        }

    },
    /**더미데이터를 위한 임시 컨트롤러 */
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