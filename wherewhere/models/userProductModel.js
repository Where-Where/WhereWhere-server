const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productIdx: {type: String, required: true},/**자동생성 -> 어떻게 함? */
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
     * 직접 저장했다면 userIdx
     * 우리가 추천하는 거라면 recommend, sponsor에 정보 입력
     */
    userIdx: {type: mongoose.SchemaTypes.ObjectId, ref: "users", required: false},
    recommend: {type: String, required: false},
    sponsor: {type: String, required: false}
});

productSchema.statics.register = function(payload){
    const user = new this(payload);
    return user.save();
};

/**
 * 데이터 가져오는건데 이거 맞나
 */
productSchema.statics.showProductsByCategory = function(userIdx, categoryIdx){
    return this.find().equals('userIdx', userIdx).equals('categoryIdx', categoryIdx);
}

module.exports = mongoose.model('userProduct', productSchema);
