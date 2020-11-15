const mongoose = require('mongoose');

const allProductSchema = new mongoose.Schema({
    siteUrl: {type: String, required: true},
    img: {type: String, required: false},
    resizedImg: {type: String, required: false},
    video: {type: String, required: false},
    resizedVideo: {type: String, required: false},
    date: {type: Date, required: true},/**가져온 일자 */
    title: {type: String, required: true},
    description: {type: String, required: true},
    plural: {type: Boolean, required: true},
    /**
     * 이미지, 동영상 여러개 : true
     * 하나만 존재 : false
     */
    mainCategory: {type: Number, required: true},
    subCategory: {type: Number, required: true},
    importance: {type: Number, default: 0},
    like: {type: Boolean, default:0},/**원래 값은 0 -> 삭제하면 지우지 않고 1로 바뀜*/
    /**
     * 해당 product를 소유한 userIdx를 저장하고
     * 추천해줄 때 해당 user가 갖지 않은 상품만 걸러서 추천해준다.
     * 
     */
});