#!/usr/bin/env node
const FTP = require('ftp')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { supportImages } = require('./util')

const ftp = new FTP()

const upload = async (config = {}, fileList) => {
    const { host, port = 21, user, password, url:configUrl, path:configPath, webp, quality } = config   
    const url = configUrl.endsWith('/') ? configUrl : configUrl + '/'
    const uploadPath = configPath && configPath.endsWith('/') ? configPath : configPath + '/'
    ftp.on('ready', function() {
        const put = async (filePath) => {
            const needWebp = webp && supportImages.indexOf(path.extname(filePath)) > -1
            const name = needWebp ? `${path.basename(filePath,path.extname(filePath))}.webp` : path.basename(filePath)
            const newPath = path.join(path.dirname(filePath),name)
            needWebp && (
                await sharp(filePath)
                    .webp({ quality: quality || 75 })
                    .toFile(newPath)
            )
            return new Promise((resolve,reject) => {
                ftp.put(newPath, uploadPath+name, function(err) {
                    if (err) {
                        reject(err)
                    }
                    ftp.end()
                    console.log(url+name)
                    needWebp && fs.unlinkSync(newPath)
                    resolve()
                })
            })
        }
        fileList.map(async item => {
            await put(item)
        })
    })
    ftp.connect({host, port, user, password})
}
module.exports = upload