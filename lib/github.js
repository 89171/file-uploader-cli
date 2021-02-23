#!/usr/local/bin/env node
const github = require('octonode')
const path = require('path')
const fs = require('fs')
const { objContainkey } = require('./util')

async function upload (config,files){
    const fileList = files.map(item=>path.resolve(process.cwd(),item))
    const client = github.client(config.token)
    const ghrepo = client.repo(`${config.user}/${config.repo}`)

    const put = async (filePath) => {
        try {
            // 上传或更新文件
            ghrepo.contents(path.join(config.path,path.basename(filePath)), async (err, data = {}) => {
                const buf = fs.readFileSync(path.resolve(process.cwd(),filePath))
                if(err && (err.statusCode === 404)) {
                    ghrepo.createContents(path.join(config.path,path.basename(filePath)), 'add File', buf, (err, data)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.resolve(`/${config.user}/${config.repo}`, config.path, path.basename(filePath))
                        const gh_page_url = 'https://' + path.join(config.repo,config.path,'/',path.basename(filePath))
                        console.log(objContainkey(config, 'jsdelivr') && !config.jsdelivr ? gh_page_url : js_delivr_url)
                    })
                }else if(data.sha){
                    ghrepo.updateContents(path.join(config.path,path.basename(filePath)), 'update File', buf, data.sha,(err, data)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.resolve(`/${config.user}/${config.repo}`, config.path, path.basename(filePath))
                        const gh_page_url = 'https://' + path.join(config.repo,config.path,'/',path.basename(filePath))
                        console.log(objContainkey(config, 'jsdelivr') && !config.jsdelivr ? gh_page_url : js_delivr_url)
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
