const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');

const userActionSchema = new mongoose.Schema({
    userIdx: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: false},
    userProductIdx: {type: mongoose.Schema.Types.ObjectId, ref: "userProduct", required: true},
    status: {type: Number, min:0, max:2, default:1, required: true},
    //유저, 추천, 광고 중 택 1
    clickDate: {type: String, default: date}
});



module.exports = mongoose.model('userAction', userActionSchema);