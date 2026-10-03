#!/usr/bin/env node
const { Octokit } = require('@octokit/rest')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const { objContainkey, supportImages } = require('./util')

async function upload (config, fileList){
    const { user, repo, path:configPath = '', branch = 'main', token, jsdelivr, webp, quality } = config
    const octokit = new Octokit({ auth: token })

    const put = async (filePath) => {
        try {
            let name, buf
            const needWebp = webp && supportImages.indexOf(path.extname(filePath)) > -1
            name = needWebp ? `${path.basename(filePath,path.extname(filePath))}.webp` : path.basename(filePath)
            const fullPath = path.posix.join(configPath, name)

            // 获取现有文件 sha（如果存在）以支持更新
            let sha
            try {
                const { data: existing } = await octokit.repos.getContent({
                    owner: user, repo, path: fullPath, ref: branch,
                })
                sha = existing.sha
            } catch (e) {
                // 文件不存在（首次上传）
            }

            if(needWebp){
                buf = await sharp(filePath)
                    .webp({ quality: quality || 75 })
                    .toBuffer();
            }else{
                buf = fs.readFileSync(filePath);
            }

            const params = {
                owner: user,
                repo,
                path: fullPath,
                message: sha ? 'update File' : 'add File',
                content: buf.toString('base64'),
                branch,
            }
            if(sha) params.sha = sha

            await octokit.repos.createOrUpdateFileContents(params)

            const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${fullPath}`
            const ghPageUrl = `https://${repo}/${configPath}/${name}`
            console.log(objContainkey(config, 'jsdelivr') && !jsdelivr ? ghPageUrl : jsDelivrUrl)
        } catch (e) {
            console.log(e)
        }
    }

    for(let i = 0; i < fileList.length; i++){
        await put(fileList[i])
    }
}

module.exports = upload