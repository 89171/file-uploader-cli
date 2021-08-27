#!/usr/bin/env node
const github = require('octonode')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const qs = require('querystring')
const { objContainkey, listFilter, supportImages } = require('./util')

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
            ghrepo.contents(configPath, branch, async (err, data) => {
                if(err) return
                const { itemContent = {} } = listFilter(data,(item,temp)=>{
                    if(item['name'] === name){
                        temp.itemContent = item
                    }
                })

                const { sha } = itemContent
                if(needWebp){
                    buf = await sharp(filePath)
                        .webp({ quality: quality || 75 })
                        .toBuffer();
                }else{
                    buf = fs.readFileSync(filePath);
                }
                if(sha){
                    ghrepo.updateContents(path.join(configPath,qs.escape(name)), 'update File', buf, sha, branch,(err)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.join(`/${user}/${repo}${branch ? '@' + branch : ''}`, configPath, qs.escape(name)).replace(/\\/g,'/')
                        const gh_page_url = 'https://' + path.join(repo, configPath,'/',qs.escape(name))
                        console.log(objContainkey(config, 'jsdelivr') && !jsdelivr ? gh_page_url : js_delivr_url)
                    })
                }else{
                    ghrepo.createContents(path.join(configPath,qs.escape(name)), 'add File', buf, branch, (err)=>{
                        if(err) console.log(err)
                        const js_delivr_url = 'https://cdn.jsdelivr.net/gh' + path.join(`/${user}/${repo}${branch ? '@' + branch : ''}`, configPath, qs.escape(name))
                        const gh_page_url = 'https://' + path.join(repo, configPath,'/',qs.escape(name)).replace(/\\/g,'/')
                        console.log(objContainkey(config, 'jsdelivr') && !jsdelivr ? gh_page_url : js_delivr_url)
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
