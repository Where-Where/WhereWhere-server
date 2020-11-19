const express = require('express');
const ffmpegModel = require('../models/ffmpegModel');

const middleware = (req, res, next)=>{
    const {
        //siteUrl,
        dataUrl,
        //resizedDataUrl,
        //date, -> default를 설정해놔서 굳이 안가져와도 될 듯?
        //title,
        //description,
        /**
         * 이미지, 동영상 여러개 : true
         * 하나만 존재 : false
         */
        //plural,
        /**
         * 만약 수동으로 카테고리 입력하면 이걸 받아오진 않을 듯...?
         * mainCategory,
         * subCategory,
         */
        //userIdx
    } = req.body;

    /**
     * 받은 data에서 image, video별로 배열 저장
     */
    var imageFiles = [];
    var videoFiles = [];
    var resizedVideoFiles = [];

    for(var key in dataUrl){
        if(key === "image"){
            imageFiles.push(dataUrl[key]);
            continue;
        }
        if(key === "video"){
            var dataUrlValue = dataUrl[key];
            videoFiles.push(dataUrlValue);
            const resizedVideo = await ffmpegModel.createFragmentPreview(dataUrlValue, 'resized'+dataUrlValue);//리사이즈된 비디오 url
            resizedVideoFiles.push(resizedVideo);
        }
    }


    /**
     * 원본 동영상을 먼저 s3에 올리고 리사이징해서 다시 s3에 올리는가,
     * 리사이징 먼저 하고, 원본 동영상과 함께 s3에 올리는가? -> 이게 맞는 듯
     */

};

module.exports = middleware;