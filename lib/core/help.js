const { program } = require('commander')

const helpOptions = () => {
    program
        .option('-t --type <type>','type to be used, enum: github | ali-oss | qiniu | ftp')
        .option('-d --default', 'set as default type')
        .option('-i --import <config>', 'import configuration')
        .option('-c --config <config>', 'specify the current configuration')
}

module.exports = helpOptions