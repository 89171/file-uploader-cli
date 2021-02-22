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
    }
    
    if(options.default){
        if(!options.type && options.config){
            throw new Error('the default option needs to specify the type')
        }else if(options.type){
            updateFile('default',options.type)
        }else{
            const type = readConfig()['default']
            if(!type) {
                throw new Error(`can't find default configuration`)
            }
            config = readConfig()[type]
            if(!config) throw new Error(`can't find configuration of type ${type}`)
        }
    }
    return config
}


module.exports = generateConfig