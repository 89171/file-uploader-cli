const { program } = require('commander')

const configCommand = () => {
    program
        .command('config <script> [type]')
        .alias('cf')
        .description('view configuration list')
        .action((script, type) => {
            console.log(script, type);
            console.log('exec "%s" using %s mode and config %s', script, options.exec_mode, program.opts().config);
        })
    program.addHelpText('after', `
查看当前配置:
    $ config list
    $ config list github | ali-oss | ftp | qiniu
清除配置:
    $ config clear
    $ config clear github | ali-oss | ftp | qiniu`
    );
      program.parse(process.argv);
}


  module.exports = {
      configCommand
  }
