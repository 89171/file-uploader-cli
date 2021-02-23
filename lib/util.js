const fs = require('fs')
const path = require('path')

// 对象是否有某个key
const objContainkey = (obj,key) => {
    return Object.keys(obj).indexOf(key) > -1
}
// 更新配置
const updateFile = (key,value) => {
    const defaultConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'config.json'), 'utf8'));
    defaultConfig[key] = value
    fs.writeFileSync(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(defaultConfig, undefined, 4), 'utf8')
}

// 读取选项指定配置
const readOptionConfig = (file) => {
    const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file), 'utf8'));
    return config
}

// 读取当前所有配置
const readConfig = () => {
    const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'config.json'), 'utf8'));
    return config
}

module.exports = {
    objContainkey,
    updateFile,
    readConfig,
    readOptionConfig
}
