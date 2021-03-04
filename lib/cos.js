#!/usr/bin/env node
const COS = require('cos-nodejs-sdk-v5')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const stream = require('stream')
const { supportImages } = require('./util')

async function upload (config, fileList){
    const { SecretId, SecretKey, Bucket, Region, StorageClass, webp, quality } = config
    var cos = new COS({
        SecretId,
        SecretKey
    });
    
    async function put (filePath) {
        try {
            let name = null, data = null;
            if(webp && supportImages.indexOf(path.extname(filePath)) > -1){
                name = `${path.basename(filePath,path.extname(filePath))}.webp`
                data = await sharp(filePath)
                    .webp({ quality: quality || 75 })
                    .toBuffer();
                // 创建一个bufferstream
                filePath = path.basename(filePath, path.extname(filePath)) + '.webp';
                readableStream = new stream.PassThrough()
                //将Buffer写入
                readableStream.end(data)
            }else{
                name = path.basename(filePath)
                data = fs.createReadStream(filePath);
            }
            cos.putObject({
                Bucket,
                Region,
                Key: name,
                StorageClass: StorageClass|| 'STANDARD',
                Body: data,
             }, function(err, data) {
                 if(data){
                     console.log(`https://${data.Location}`)
                 }
             });
        } catch (e) {
            console.log(e);
        }
    }
    for(let i = 0; i < fileList.length; i++){        
        await put(fileList[i])
    }
}

module.exports = upload


// 创建实例


