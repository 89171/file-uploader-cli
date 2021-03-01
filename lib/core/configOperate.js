const { program } = require('commander')
const { readConfig, deleteConfig } = require('../util')

const configOperate = () => {
    const options = program.opts()
    options.remove && deleteConfig(options.type)
    options.list && (options.type ? readConfig()[options.type]: readConfig())
}

module.exports = configOperate
