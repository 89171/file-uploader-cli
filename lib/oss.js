#!/usr/local/bin/node
const OSS = require('ali-oss')
const webp = require('webp-converter')
const path = require('path')
const imgList  = process.argv.slice(2)
const client = new OSS({
  bucket: 'typora-common',
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI4GCDXZDNYGdmjeHDULe5',
  accessKeySecret: 'FDb2O0ZzvWmpJLDUxKApTGD6lFQrPj',
});
async function put (imgPath) {
  try {
    let result = await client.put(path.basename(imgPath), imgPath);
    console.log(result.url);
  } catch (e) {
    console.log(e);
  }
}
async function upload (){
    for(let i = 0; i < imgList.length; i++){
        await put(imgList[i])
    }
}

upload()