#!/usr/bin/env node
const ftp = require('basic-ftp')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { supportImages } = require('./util')

const upload = async (config = {}, fileList) => {
    const { host, port = 21, user, password, url:configUrl, path:configPath, webp, quality } = config
    const url = configUrl.endsWith('/') ? configUrl : configUrl + '/'
    const uploadPath = (configPath && configPath.endsWith('/')) ? configPath : (configPath || '') + '/'
    const client = new ftp.Client()
    client.ftp.verbose = false

    const put = async (filePath) => {
        const needWebp = webp && supportImages.indexOf(path.extname(filePath)) > -1
        const name = needWebp ? `${path.basename(filePath,path.extname(filePath))}.webp` : path.basename(filePath)
        const newPath = path.join(path.dirname(filePath),name)
        if(needWebp){
            await sharp(filePath)
                .webp({ quality: quality || 75 })
                .toFile(newPath)
        }
        try {
            await client.uploadFrom(newPath, uploadPath + name)
            console.log(url + name)
        } finally {
            if(needWebp) fs.unlinkSync(newPath)
        }
    }

    try {
        await client.access({ host, port, user, password })
        for (const item of fileList) {
            await put(item)
        }
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
}
module.exports = upload