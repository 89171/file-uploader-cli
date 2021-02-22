#!/usr/local/bin/node
const OSS = require('ali-oss')
const path = require('path')

async function upload (config,imgs){
    console.log(config,imgs)
    const imgList = imgs.map(item=>path.resolve(process.cwd(),item))
    const client = new OSS(config);
      async function put (imgPath) {
        try {
          let result = await client.put(path.basename(imgPath), imgPath);
          console.log(result.url);
        } catch (e) {
          console.log(e);
        }
      }
    for(let i = 0; i < imgList.length; i++){
        await put(imgList[i])
    }
}

// upload()
module.exports = upload