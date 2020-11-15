const mongoose = require('mongoose');

const userActionSchema = new mongoose.Schema({
    userIdx: {type: String, required: true},
    /**
     * 해당 user가 클린한 product의 idx
    */
    userProductIdx: {type: String, required: true},
    status: {type: Number, required: true},
    clickDate: {type: Date, required: true}
});