#!/usr/local/bin/env node
const github = require('octonode');
const path = require('path');
const fs = require('fs')
const imgList  = process.argv.slice(2)
const config = {
    token: '0b0db41093fcdc3c51a4736fb440a7f0c5063839',
    user: 'Iamxiaozhu',
    repo: 'Iamxiaozhu.github.io',
    path: 'css/img'
}

const client = github.client(config.token);
const ghrepo = client.repo(`${config.user}/${config.repo}`);

async function put (imgPath) {
    try {
        // 上传或更新文件
        ghrepo.contents(path.join(config.path,path.basename(imgPath)), (err,data = {}) => {
            const buf = fs.readFileSync(path.resolve(process.cwd(),imgPath))
            if(data.sha){
                ghrepo.updateContents(path.resolve(config.path,path.basename(imgPath)), 'update File', buf, data.sha, (err,res)=>{
                    console.log('https://' + path.join(config.repo,config.path,'/',path.basename(imgPath)))
                });
            } else {
                ghrepo.createContents(path.join(config.path,path.basename(imgPath)), 'add File', buf, (err,data)=>{
                    console.log('https://' + path.join(config.repo,config.path,'/',path.basename(imgPath)))
                });
            }
        });
    } catch (e) {
    }
  }
  
  async function upload (){
      for(let i = 0; i < imgList.length; i++){
          await put(imgList[i])
      }
  }
  
  upload()
