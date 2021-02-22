#!/usr/bin/env node
const { program } = require('commander')
const helpOptions = require('./lib/core/help')
const fs = require('fs')
const path = require('path')
const { useTypeAction } = require('./lib/core/actions')
const generateConfig = require('./lib/core/generateConfig')
const pkg = require('./package.json')

helpOptions()

program
    .version(pkg.version)
    .parse(process.argv);

const config = generateConfig()
const { type } = program.opts()
if(['github','ali-oss','qiniu','ftp'].indexOf(type) > -1){
    require(`./lib/${type}`)(config,program.args)
}
console.log(config)
console.log(program.args)