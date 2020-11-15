const mongoose = require('mongoose');
/**
 * mongoose는 사용자가 작성한 schema를 기준으로
 * 데이터를 db에 넣기 전에 먼저 검사한다.
 * schema에 어긋나는 데이터가 있으면 에러를 발생시킨다.
 */
const userSchema = new mongoose.Schema({
    userIdx: {type: String, required: true},
    sns_category: {type: String, required: true},
    token: {type: String, required: true},
    refresh_token: {type: String, required: true},
    signup_date: {type: Date, required: true, default: Date.now}
});

userSchema.statics.createUser = function(payload){
    const user = new this(payload);
    return user.save();
};

userSchema.statics.deleteUser = function(userIdx){
    return this.remove({userIdx});
}

module.exports = mongoose.model('user', userSchema);

