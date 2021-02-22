#!/usr/local/bin/env node
const github = require('octonode')
const path = require('path')
const fs = require('fs')

async function upload (config,files){
    const fileList = files.map(item=>path.resolve(process.cwd(),item))
    const client = github.client(config.token)
    const ghrepo = client.repo(`${config.user}/${config.repo}`)

    async function put (imgPath) {
        try {
            // 上传或更新文件
            ghrepo.contents(path.join(config.path,path.basename(imgPath)), (err,data = {}) => {
                if(err) console.log(err)
                const buf = fs.readFileSync(path.resolve(process.cwd(),imgPath))
                if(data.sha){
                    ghrepo.updateContents(path.resolve(config.path,path.basename(imgPath)), 'update File', buf, data.sha, (err,res)=>{
                        console.log('https://' + path.join(config.repo,config.path,'/',path.basename(imgPath)))
                    })
                } else {
                    ghrepo.createContents(path.join(config.path,path.basename(imgPath)), 'add File', buf, (err,data)=>{
                        console.log('https://' + path.join(config.repo,config.path,'/',path.basename(imgPath)))
                    })
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    for(let i = 0; i < fileList.length; i++){
        await put(fileList[i])
    }
}

module.exports = upload
