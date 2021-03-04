const { program } = require('commander')
const { readConfig, deleteConfig, updateFile } = require('../util')

const configOperate = () => {
    const opts = program.opts()
    const {type, remove, list} = opts
    opts.default && type && updateFile('default',type)
    remove && deleteConfig(type)
    list && (console.log(type ? readConfig()[type]: readConfig()))
}

module.exports = configOperate
