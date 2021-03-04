#!/usr/bin/env node
// https://developer.qiniu.com/kodo/1289/nodejs
// 七牛测试域名，每个域名每日限总流量 10GB，每个测试域名自创建起 30 个自然日后系统会自动回收
const qiniu = require('qiniu')
const stream = require('stream')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { objContainkey, supportImages } = require('./util')

const upload = async (setting, fileList) => {  
    const { zone, useHttpsDomain, useCdnDomain, accessKey, secretKey, scope, quality, webp } = setting  
    const config = new qiniu.conf.Config()
    // 空间对应的机房
    config.zone = qiniu.zone[zone]
    // 是否使用https域名
    objContainkey(setting, 'useHttpsDomain') && (config.useHttpsDomain = useHttpsDomain)
    // 上传是否使用cdn加速
    objContainkey(setting, 'useHttpsDomain') && (config.useCdnDomain = useCdnDomain)
    
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var options = {
      scope
    }
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)
    
    var formUploader = new qiniu.form_up.FormUploader(config)
    var putExtra = new qiniu.form_up.PutExtra()
    
    for(let i = 0; i < fileList.length; i++){
        let filePath = fileList[i]        
        let readableStream = null
        if(webp && supportImages.indexOf(path.extname(filePath)) > -1){
            const data = await sharp(filePath)
                .webp({ quality: quality || 75 })
                .toBuffer()
            // 创建一个bufferstream
            filePath = path.basename(filePath, path.extname(filePath)) + '.webp'
            readableStream = new stream.PassThrough()
            //将Buffer写入
            readableStream.end(data)
        }else{
            readableStream = fs.createReadStream(filePath)
        }
        formUploader.putStream(uploadToken, path.basename(filePath), readableStream, putExtra, function(respErr, respBody, respInfo) {
          if (respErr) {
            throw respErr
          }
          if (respInfo.statusCode == 200) {
            console.log(`${setting.domain}/${respBody.key}`)
          } else {
            console.log(respInfo.statusCode)
            // console.log(respBody)
          }
        })
    }
}
module.exports = upload