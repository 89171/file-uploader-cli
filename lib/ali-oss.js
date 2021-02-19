#!/usr/local/bin/node
const OSS = require('ali-oss')
const sharp = require('sharp')
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
    const webpName = `${path.basename(imgPath,path.extname(imgPath))}.webp`
    const data = await sharp(imgPath)
        .webp({ quality: 75 })
        .toBuffer();
    let result = await client.put(webpName, data);
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





