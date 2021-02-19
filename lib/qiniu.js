#!/usr/bin/env node
// https://developer.qiniu.com/kodo/1289/nodejs
// 七牛测试域名，每个域名每日限总流量 10GB，每个测试域名自创建起 30 个自然日后系统会自动回收
const qiniu = require('qiniu')
const stream = require('stream')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const authConfig = {
    domain:'http://qoltc3zfl.hb-bkt.clouddn.com',
    accessKey: 'OSx4MNbx_WV3iDO9VLpiSCUdVbCpV2nl01_tWHqd',
    secretKey: 'eUUCUnBqemFE5As8jfO_f1szKP3EH6MHyB5ph04b',
    zone: 'Zone_z1',
    useHttpsDomain: false,
    useCdnDomain: false,
    quality: 95
}

const fileList  = process.argv.slice(2)

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone[authConfig.zone];
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;

var mac = new qiniu.auth.digest.Mac(authConfig.accessKey, authConfig.secretKey);

var options = {
  scope: 'all-static-files',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
const upload = async () => {
    for(let i = 0; i < fileList.length; i++){
        let filePath = fileList[i]        
        let readableStream = null;
        if(authConfig.quality && ['.png','.jpg','.jpeg','.gif','.svg'].indexOf(path.extname(filePath)) > -1){
            const data = await sharp(filePath)
                .webp({ quality: authConfig.quality })
                .toBuffer();
            // 创建一个bufferstream
            filePath = path.basename(filePath, path.extname(filePath)) + '.webp';
            readableStream = new stream.PassThrough()
            //将Buffer写入
            readableStream.end(data)
        }else{
            readableStream = fs.createReadStream(filePath);
        }
        formUploader.putStream(uploadToken, path.basename(filePath), readableStream, putExtra, function(respErr, respBody, respInfo) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            console.log(`${authConfig.domain}/${respBody.key}`)
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        });
    }
}

upload()