#!/usr/bin/env node
const { program } = require('commander')
const helpOptions = require('./lib/core/help')
const generateConfig = require('./lib/core/generateConfig')
const pkg = require('./package.json')
const configOperate = require('./lib/core/configOperate')
const { readConfig, absolutePath } = require('./lib/util')

helpOptions()

program
    .version(pkg.version)
    .parse(process.argv);

configOperate()

const config = generateConfig()
const options = program.opts()
const type = options['type'] || readConfig()['default']
if(['github','ali-oss','qiniu','ftp'].indexOf(type) > -1){
    if(options.length === 0 && program.args.length === 0){
        console.log('please specify the file to upload')
        return
    }
    const fileList = absolutePath(program.args)
    fileList.length > 0 && require(`./lib/${type}`)(config,fileList)
}