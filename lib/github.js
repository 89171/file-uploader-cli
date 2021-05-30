#!/usr/bin/env node
const github = require('octonode')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const { objContainkey, supportImages } = require('./util')

async function upload (config,fileList){
    const { user, repo, path:configPath = '', branch = 'main', token, jsdelivr, webp, quality } = config
    const client = github.client(token)
    const ghrepo = client.repo(`${user}/${repo}`)
    const put = async (filePath) => {
        try {
            let name,buf;
            const needWebp = webp && supportImages.indexOf(path.extname(filePath)) > -1
            name = needWebp ? `${path.basename(filePath,path.extname(filePath))}.webp` : path.basename(filePath)
            // 上传或更新文件
            ghrepo.contents(path.join(configPath,name), branch, async (err, data) => {
                const { sha } = data || {}
                if(needWebp){
                    buf = await sharp(filePath)
                        .webp({ quality: quality || 75 })
                        .toBuffer();
                }else{
                    buf = fs.readFileSync(filePath);
                }
                if(err && (err.statusCode === 404)) {
                    ghrepo.createContents(path.join(configPath,name), 'add File', buf, branch, (err)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.join(`/${user}/${repo}${branch ? '@' + branch : ''}`, configPath, name)
                        const gh_page_url = 'https://' + path.join(repo, configPath,'/',name).replace(/\\/g,'/')
                        console.log(objContainkey(config, 'jsdelivr') && !jsdelivr ? gh_page_url : js_delivr_url)
                    })
                }else if(sha){
                    ghrepo.updateContents(path.join(configPath,name), 'update File', buf, sha, branch,(err)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.join(`/${user}/${repo}${branch ? '@' + branch : ''}`, configPath, name).replace(/\\/g,'/')
                        const gh_page_url = 'https://' + path.join(repo, configPath,'/',name)
                        console.log(objContainkey(config, 'jsdelivr') && !jsdelivr ? gh_page_url : js_delivr_url)
                    })
                }else{
                    console.log(err)
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
