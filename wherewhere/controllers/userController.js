const express = require('express');
const userModel = require('../models/userModel');
const signInModel = require('../models/signinModel');
const jwt = require('jsonwebtoken');

module.exports = {
    googleSignIn: async(req, res)=>{
        /*
        const CLIENT_ID = googleInfo.CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);
        const verify = async ()=>{
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
        }
        */
        const token = req.body.id_token;//맞는 형식인지 확인
        try{
            const payload = await signInModel.verifyGoogleSignIn(token);
            /**
             * payload가 비어있을 때 오류처리 해줘야 함.
             */
            console.log('google payload : ', payload);
            /**
             * 사용자 가입?
             */
        }catch(err){
            console.log('google signIn verify ERROR : ', err);
            return; // 비정상 종료
        }
    },
    facebookSignIn: async(req, res)=>{
        /**
         * 확실하지 않은 코드
         */
        const code = req.query.code;//이 code로 accessToken 발급받아야함
        /**
        https://graph.facebook.com/v2.11/oauth/access_token?
        client_id={app-id} // app ID
        &redirect_uri={redirect-uri} // 처음 등록할 때 redirect uri와 동일하게
        &client_secret={app-secret} // 앱 시크릿 코드
        &code={code-parameter} // 전달받은 code 변수
         */
        




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