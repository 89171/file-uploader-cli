const FTP = require('ftp')
const ftp = new FTP()
const path = require('path')

const upload = async (config = {}, fileList) => {
    const url = config.url.endsWith('/') ? config.url : config.url + '/'
    const uploadPath = config.path && config.path.endsWith('/') ? config.path : config.path + '/'
    ftp.on('ready', function() {
        const put = (filePath) => {
            return new Promise((resolve,reject) => {
                const basename = path.basename(filePath)
                ftp.put(filePath, uploadPath+basename, function(err) {
                    if (err) {
                        reject(err)
                    }
                    ftp.end()
                    console.log(url+basename)
                    resolve()
                })
            })
        }
        fileList.map(async item => {
            await put(item)
        })
    })
    
    ftp.connect(config)
}
module.exports = upload