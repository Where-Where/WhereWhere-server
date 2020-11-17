const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const googleInfo = require('../config/googleInfo.json');
const {OAuth2Client} = require('google-auth-library');

module.exports = {
    getAppleSignInKeys: async (kid)=>{
        try{
            const client = jwksClient({
                jwksUri: 'https://appleid.apple.com/auth/keys'
            });
            const key = await client.getSigningKeyAsync(kid); // console찍어보기
            console.log('key: ', key);
            //const signingKey = (await key).getPublicKey();
            const signingKey = key.getPublicKey();
            console.log('signingKey : ', signingKey);
            return signingKey;
            //
            //client.getSigningKey(kid, (err, key)=>{
            //console 찍었는데 이상하면
            //callback으로 실행하면 된다.
            //})
        }catch(err){
            console.log('get Apple SignIn Keys ERROR : ', err);
            return null;
        }
    },
    verifyJWT: async(json, publicKey)=>{
        try{
            const payload = jwt.verify(json, publicKey);
            return payload;
        }catch(err){
            console.error('verify jwt error');
            return null;
        }
    },
    verifyGoogleSignIn: async(token)=>{
        const CLIENT_ID = googleInfo.CLIENT_ID;
        const client = new OAuth2Client(CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        return payload;
    }
}