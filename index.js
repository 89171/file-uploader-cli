#!/usr/bin/env node
const { program } = require('commander')
const helpOptions = require('./lib/core/help')
const generateConfig = require('./lib/core/generateConfig')
const pkg = require('./package.json')
const { configCommand } = require('./lib/core/command')

helpOptions()
configCommand()

program
    .version(pkg.version)
    .parse(process.argv);


const config = generateConfig()
const { type } = program.opts()
if(['github','ali-oss','qiniu','ftp'].indexOf(type) > -1){
    require(`./lib/${type}`)(config,program.args)
}