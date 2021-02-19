const { program } = require('commander')
const { useTypeAction } = require('./actions')

const helpOptions = () => {
    program
        .option('-s --serve <type>','Type to be used, enum: github | ali-oss | qiniu | ftp', useTypeAction)
        .option('-d --default <default>', 'default')
}

module.exports = helpOptions