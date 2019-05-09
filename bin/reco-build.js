#! /usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

const handleInquirer = require('./inquirer.js')

program
  .version('0.0.1')
  .option('-i, init [name]', '初始化 vuepress-theme-reco 主题博客')
  .parse(process.argv);

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ reco-cli init my-blog')
  console.log()
})

if (program.init) {
  handleInquirer()
    .then(res => {
      const gitBranch = `recoluan/vuepress-theme-reco-demo#demo/${res}`
      const spinner = ora().start();
      console.info(chalk.blue('[1/2] Load file from git'));
      download(gitBranch, program.init, function (err) {
        if(!err){
          console.info(chalk.blue('[2/2] Edit package.json'));
          changePackage().then(() => {
            spinner.stop()
            console.log()
            console.info(chalk.greenBright('Load successful, enjoy it!'));
            console.log()
            console.log(chalk.gray('# Inter your blog'))
            console.log(`$ cd ${program.init}`)
            console.log(chalk.gray('# Install package'))
            console.log('$ npm install')
          })
        }else{
          console.info(chalk.redBright('load fail!'));
          console.info(err)
          spinner.stop()
        }
      })
    })
    .catch(err => {
      console.info(chalk.redBright(err));
    })
}  

function changePackage () {
  return new Promise((resolve) => {
    fs.readFile(`${process.cwd()}/${program.init}/package.json`, (err, data) => {
      if (err) throw err;
      let _data = JSON.parse(data.toString())
      _data.name = program.init
      _data.version = '1.0.0'
      let str = JSON.stringify(_data, null, 4);
      fs.writeFile(`${process.cwd()}/${program.init}/package.json`, str, function (err) {
        resolve()
        if (err) throw err
      })
    })
  })
}

