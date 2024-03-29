const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');
/**
 * mongoose는 사용자가 작성한 schema를 기준으로
 * 데이터를 db에 넣기 전에 먼저 검사한다.
 * schema에 어긋나는 데이터가 있으면 에러를 발생시킨다.
 */
const userSchema = new mongoose.Schema({
    sns_category: {type: String, enum: ['google', 'facebook', 'apple'], required: true},
    uid: {type: String, required: true},
    signup_date: {type: String, required: true, default: date},
    //refresh_token: {type: String, required: true},
});

userSchema.statics.createUser = function(payload){
    const user = new this(payload);
    return user.save();
};

userSchema.statics.findByUid = function(uid){
    return this.findOne({"uid":uid});
};


userSchema.statics.deleteUser = function(userIdx){
    return this.remove({userIdx});
}

module.exports = mongoose.model('user', userSchema);

