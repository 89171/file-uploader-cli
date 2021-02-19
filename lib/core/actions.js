const { program } = require('commander')

const options = program.opts()

const useTypeAction = () => {
    console.log(options)
    console.log(options.type)
    console.log(options.serve)
}

module.exports = {
    useTypeAction
}