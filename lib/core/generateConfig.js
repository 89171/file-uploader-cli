const { program } = require('commander')
const { updateFile, readOptionConfig, readConfig } = require('../util')

const generateConfig = () => {
    let config = null
    const options = program.opts()
    // 如果指定配置  使用当前指定
    if(options.config){
        if(!options.type){
            throw new Error('configuration needs to specify the type')
        }else{
            config = readOptionConfig(options.config)
            updateFile(options.type, config)
        }
    }else if(options.type){
        config = readConfig()[options.type]
    }else{
        const setting = readConfig()
        config = setting[setting.default]
    }
    return config
}

module.exports = generateConfig