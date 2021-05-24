const { writeFileSync, readFileSync, statSync, accessSync, constants } = require('fs')
const path = require('path')
const configPath = path.resolve(__dirname, '..', 'config.json')
const supportList = ['github','ali-oss','qiniu','ftp','cos','jdcloud']
const supportImages = ['.png','.jpg','.jpeg','.svg']

// 对象是否有某个key
const objContainkey = (obj,key) => {
    return Object.keys(obj).indexOf(key) > -1
}

// 删除配置
const deleteConfig = (key) => {
    createConfigFile()
    if(!key){
        writeFileSync(configPath, "{}", 'utf8')
    }
    const defaultConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    delete defaultConfig[key]
    writeFileSync(configPath, JSON.stringify(defaultConfig, undefined, 4), 'utf8')
}

// 更新配置
const updateFile = (key,value) => {
    createConfigFile()
    const defaultConfig = JSON.parse(readFileSync(configPath, 'utf8'));
    defaultConfig[key] = value
    const keys = Object.keys(defaultConfig)
    if(keys.length === 1 && supportList.includes(keys[0])){
        defaultConfig.default = key
    }
    writeFileSync(configPath, JSON.stringify(defaultConfig, undefined, 4), 'utf8')
}

// 读取选项指定配置
const readOptionConfig = (file) => {
    createConfigFile()
    const config = JSON.parse(readFileSync(path.resolve(process.cwd(), file), 'utf8'));
    return config
}

// 读取当前所有配置
const readConfig = () => {
    createConfigFile()
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return config
}

const absolutePath = (files) => {
    const fileList = []
    const list = files.map(item=>path.resolve(process.cwd(),item))
    for(let file of list){
        try{
            const stats = statSync(file)
            stats.isFile() ? fileList.push(file) : console.log('file not found')
        }catch(err){
            console.log(err)
        }
    }
    return fileList
}
const fileExists = (file) => {
    try {
        accessSync(file, constants.F_OK );
        return true
      } catch (err) {
        return false
      }
}
const createConfigFile = () => {
    if(fileExists(configPath)) return
    writeFileSync(configPath, "{}", 'utf8')
}
module.exports = {
    objContainkey,
    deleteConfig,
    updateFile,
    readConfig,
    readOptionConfig,
    absolutePath,
    supportList,
    supportImages
}
