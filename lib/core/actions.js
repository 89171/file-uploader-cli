const { program } = require('commander')

const useTypeAction = () => {
    const options = program.opts()
    console.log(options)
    console.log(options.type)
    console.log(options.serve)
}

module.exports = {
    useTypeAction
}