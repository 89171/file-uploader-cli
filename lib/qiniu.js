#!/usr/bin/env node
// https://developer.qiniu.com/kodo/1289/nodejs
// 七牛测试域名，每个域名每日限总流量 10GB，每个测试域名自创建起 30 个自然日后系统会自动回收
const qiniu = require('qiniu')
const stream = require('stream')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { objContainkey } = require('./util')

const upload = async (setting, files) => {
    const fileList = files.map(item=>path.resolve(process.cwd(),item))
    
    const config = new qiniu.conf.Config()
    // 空间对应的机房
    config.zone = qiniu.zone[setting.zone]
    // 是否使用https域名
    objContainkey(setting, 'useHttpsDomain') && (config.useHttpsDomain = setting.useHttpsDomain)
    // 上传是否使用cdn加速
    objContainkey(setting, 'useHttpsDomain') && (config.useCdnDomain = setting.useCdnDomain)
    
    var mac = new qiniu.auth.digest.Mac(setting.accessKey, setting.secretKey)    
    var options = {
      scope: setting.scope
    }
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)
    
    var formUploader = new qiniu.form_up.FormUploader(config)
    var putExtra = new qiniu.form_up.PutExtra()
    
    for(let i = 0; i < fileList.length; i++){
        let filePath = fileList[i]        
        let readableStream = null
        if(setting.quality && ['.png','.jpg','.jpeg','.gif','.svg'].indexOf(path.extname(filePath)) > -1){
            const data = await sharp(filePath)
                .webp({ quality: setting.quality })
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