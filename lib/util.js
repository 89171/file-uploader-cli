const { writeFileSync, readFileSync, statSync } = require('fs')
const path = require('path')

// 对象是否有某个key
const objContainkey = (obj,key) => {
    return Object.keys(obj).indexOf(key) > -1
}

// 删除配置
const deleteConfig = (key) => {
    if(!key){
        writeFileSync(path.resolve(__dirname, '..', 'config.json'), "{}", 'utf8')
    }    
    const defaultConfig = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'config.json'), 'utf8'));
    delete defaultConfig[key]
    writeFileSync(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(defaultConfig, undefined, 4), 'utf8')
}

// 更新配置
const updateFile = (key,value) => {
    const defaultConfig = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'config.json'), 'utf8'));
    defaultConfig[key] = value
    writeFileSync(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(defaultConfig, undefined, 4), 'utf8')
}

// 读取选项指定配置
const readOptionConfig = (file) => {
    const config = JSON.parse(readFileSync(path.resolve(process.cwd(), file), 'utf8'));
    return config
}

// 读取当前所有配置
const readConfig = () => {
    const config = JSON.parse(readFileSync(path.resolve(__dirname, '..', 'config.json'), 'utf8'));
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

module.exports = {
    objContainkey,
    deleteConfig,
    updateFile,
    readConfig,
    readOptionConfig,
    absolutePath
}
