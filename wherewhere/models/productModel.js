const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');

const productSchema = new mongoose.Schema({
    siteUrl: {type: String, required: true},
    dataUrl: [{
        category: {type: String, enum: ['image', 'video'], required: true},
        url: {type: String, required: true}
    }],
    resizedDataUrl: [{
        category: {type: String, enum: ['image', 'video'], required: true},
        url: {type: String, required: true}
    }],
    date: {type: String, default: date},/**가져온 일자 */
    writer: {type: String, required: true},
    description: {type: String, required: true},
    plural: {type: Boolean, required: true},
    /**
     * 이미지, 동영상 여러개 : true
     * 하나만 존재 : false
     */
    mainCategory: {type: Number, required: true, default: 1},
    subCategory: {type: Number, required: true, default: 3},
    importance: {type: Number, default: 0},// 중요도 -> 하트 클릭(1)/ default (0)
    like: {type: Boolean, default:false},// 삭제하면 (true)/ default (false)
    userIdx: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
});

productSchema.statics.register = function(payload){
    const product = new this(payload);
    return product.save();
};

productSchema.statics.showAllById = function(_id){
    return this.find().sort({date: -1})
                .where('userIdx').equals(_id)
                .populate("userIdx");
};

productSchema.statics.showProductsBySubCategory = function(_id, subCategoryIdx){
    return this.find().sort({date: -1})
                .where('subCategory').equals(subCategoryIdx)
                .where('like').equals(false)
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

productSchema.statics.showByMainCategory = function(_id, mainCategoryIdx){
    return this.find().sort({date: -1})
                .where('mainCategory').equals(mainCategoryIdx)
                .where('like').equals(false)
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

productSchema.statics.showOneProductDetail = function(_id, productIdx){
    return this.find()
                .where('_id').equals(mongoose.Types.ObjectId(productIdx))
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

productSchema.statics.deleteOneProduct = function(_id, payload){
    return this.findOneAndUpdate({_id}, payload, {new: true});
};

productSchema.statics.heartClicked = function(_id, payload){
    return this.findOneAndUpdate({_id}, payload, {new: true});
}

module.exports = mongoose.model('Product', productSchema);
