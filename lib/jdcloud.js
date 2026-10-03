#!/usr/bin/env node
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { S3Client } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const mimeTypes = require('mime-types')
const { supportImages } = require('./util')

async function upload (config, fileList){
    const { accessKeyId, secretAccessKey, region, bucket, webp, quality } = config
    const client = new S3Client({
        endpoint: `https://s3.${region}.jdcloud-oss.com`,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
        signatureVersion: 'v4',
    })

    async function put (filePath) {
        const { fileTypeFromFile } = await import('file-type')
        const mime = (await fileTypeFromFile(filePath) || {}).mime || mimeTypes.lookup(filePath)
        try {
            let name = null, data = null;
            if(webp && supportImages.indexOf(path.extname(filePath)) > -1){
                name = `${path.basename(filePath,path.extname(filePath))}.webp`
                data = await sharp(filePath)
                    .webp({ quality: quality || 75 })
                    .toBuffer();
            }else{
                name = path.basename(filePath)
                data = fs.createReadStream(filePath)
            }
            const params = {
                Bucket: bucket,
                Key: name,
                Body: data,
                ContentType: mime,
            }
            const parallelUpload = new Upload({ client, params })
            await parallelUpload.done()
            console.log(`https://${bucket}.s3.${region}.jdcloud-oss.com/${name}`)
        } catch (e) {
            console.log(e);
        }
    }
    for(let i = 0; i < fileList.length; i++){
        await put(fileList[i])
    }
}

module.exports = upload