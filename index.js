#!/usr/bin/env node
const { program } = require('commander')
// const helpOptions = require('./lib/core/help')
const { useTypeAction } = require('./lib/core/actions')
const pkg = require('./package.json')

// helpOptions()

program
    .option('-s --serve <type>','serve to be used, enum: github | ali-oss | qiniu | ftp', useTypeAction)
    .option('-d --default <default>', 'default')
    .version(pkg.version)
    .parse(process.argv);

const options = program.opts();
console.log(options);
