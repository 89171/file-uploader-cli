const { program } = require('commander')
const { supportList } = require('../util')

const helpOptions = () => {
    program
        .option('-t --type <type>',`type to be used, enum: ${supportList.join(' | ')}`)
        .option('-d --default', 'set as default type')
        .option('-c --config <config>', 'specify the current configuration')
        .option('-l --list', 'view configuration list')
        .option('-r --remove', 'remove configuration')
        .addHelpText('after', `
view configuration:
    $ fuc -l
    $ fuc -l -t ${supportList.join(' | ')}
remove configuration:
    $ fuc -r
    $ fuc -r -t ${supportList.join(' | ')}`
)
}
module.exports = helpOptions