const { program } = require('commander')

const helpOptions = () => {
    program
        .option('-t --type <type>','type to be used, enum: github | ali-oss | qiniu | ftp')
        .option('-d --default', 'set as default type')
        .option('-c --config <config>', 'specify the current configuration')
        .option('-l --list', 'view configuration list')
        .option('-r --remove', 'remove configuration')
        .addHelpText('after', `
view configuration:
    $ config -l
    $ config -l -t github | ali-oss | ftp | qiniu
remove configuration:
    $ config -r
    $ config -r -t github | ali-oss | ftp | qiniu`
)
}
module.exports = helpOptions