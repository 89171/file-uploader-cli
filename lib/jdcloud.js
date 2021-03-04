#!/usr/bin/env node
const sharp = require('sharp')
const fs = require('fs')
const stream = require('stream')
const AWS = require('aws-sdk')
const path = require('path')
const FileType = require('file-type')
const mimeTypes = require('mime-types')
const { supportImages } = require('./util')

async function upload (config, fileList){
    const { accessKeyId, secretAccessKey, region, bucket, webp, quality } = config
    const s3 = new AWS.S3()
    s3.endpoint = `https://s3.${region}.jdcloud-oss.com`
    s3.config.update({
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: "v4"
    })
    async function put (filePath) {
        const mime = (await FileType.fromFile(filePath) || {}).mime || mimeTypes.lookup(filePath)
        try {
            let name = null, data = null;
            if(webp && supportImages.indexOf(path.extname(filePath)) > -1){
                name = `${path.basename(filePath,path.extname(filePath))}.webp`
                data = await sharp(filePath)
                    .webp({ quality: quality || 75 })
                    .toBuffer();
                // 创建一个bufferstream
                filePath = path.basename(filePath, path.extname(filePath)) + '.webp'
                readableStream = new stream.PassThrough()
                //将Buffer写入
                readableStream.end(data)
            }else{
                name = path.basename(filePath)
                data = fs.createReadStream(filePath)
            }
            var params = {
                Body: data, 
                Bucket: bucket,
                ContentType: mime,
                Key: name,
            }
            s3.putObject(params, function(err, data) {
                !err && console.log(`https://${bucket}.s3.${region}.jdcloud-oss.com/${name}`)
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