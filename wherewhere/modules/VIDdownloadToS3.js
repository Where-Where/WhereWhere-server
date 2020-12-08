const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../config/s3.json');
const s3 = new aws.S3();
const axios = require('axios');
const FileType = require('file-type');
const request = require('request')

module.exports = {
    download : async(url, vidName, cnt)=>{
        let myS3url = await module.exports.downloadAttachment(url, vidName, cnt);
        return myS3url;
    },
    uploadAttachmentToS3: async(type, buffer, vidName, cnt)=>{
        var paramsType = type.substring(6);
        console.log('type : ', type, ' paramsType : ', paramsType);

        var params = {
            Key: `videos/original/${vidName}${cnt}.${paramsType}`,
            Body: buffer,
            Bucket: "wherewhere-bucket",
            ContentType: type,
            ACL: 'public-read'
        };
        return s3.upload(params).promise().then((response)=>{
            return {
                location: response.Location,
                fileName: params.Key
            }
        }, (err)=>{
            return {type: 'error', err: err}
        });
    },
    downloadAttachment: async(url, vidName, cnt)=>{
        return axios.get(url, {
            responseType: 'arraybuffer'
        })
        .then(response=>{
            const buffer = Buffer.from(response.data, 'base64');
            return (async()=>{
                let type = (await FileType.fromBuffer(buffer)).mime;
                return module.exports.uploadAttachmentToS3(type, buffer, vidName, cnt)
            })();
        })
        .catch(err=>{
            return {type: 'error', err: err}
        });
    }
}