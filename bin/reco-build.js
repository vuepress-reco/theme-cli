#! /usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

const handleInquirer = require('./inquirer.js')
const spinner = ora()

let stepNum = 3
let currentStep = 1

program
  .version('1.0.0')
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
    .then(choices => {
      const { style } = choices
      stepNum = style === 'afternoon-grocery' ? 1 : style === 'doc' ? 2 : 3
      const branchName = style === 'afternoon-grocery' ? 'afternoon-grocery' : '1.x'
      const gitBranch = `recoluan/vuepress-theme-reco-demo#demo/${branchName}`
      spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Load file from git`));
      
      download(gitBranch, program.init, function (err) {
        if(!err){
          spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Load file from git`));
          currentStep++
          handleDownload(choices)
        }else{
          spinner.fail(chalk.redBright(`[${currentStep}/${stepNum}] Load file from git`));
          console.info(err)
          spinner.stop()
        }
      })
    })
    .catch(err => {
      console.info(chalk.redBright(err));
    })
}  

function handleDownload(choices) {
  if (choices.style === 'afternoon-grocery') {
    handleEnd(spinner)
    return
  }

  if (choices.style === 'doc') {
    changePackage(choices).then(() => {
      handleEnd(spinner)
    })
    return
  }
  
  Promise.all([changePackage(choices), changeConfig(choices)]).then(() => {
    handleEnd(spinner)
  })
}

function handleEnd (spinner) {
  spinner.stop()
  console.log()
  console.info(chalk.greenBright('Load successful, enjoy it!'));
  console.log()
  console.log(chalk.gray('# Inter your blog'))
  console.log(`$ cd ${program.init}`)
  console.log(chalk.gray('# Install package'))
  console.log('$ npm install')
}
 
function changePackage (choices) {
  spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`));
  
  return new Promise((resolve) => {
    fs.readFile(`${process.cwd()}/${program.init}/package.json`, (err, data) => {
      if (err) throw err;
      let _data = JSON.parse(data.toString())
      _data.name = program.init
      _data.description= choices.description 
      _data.version = '1.0.0'
      let str = JSON.stringify(_data, null, 2);
      fs.writeFile(`${process.cwd()}/${program.init}/package.json`, str, function (err) {
        if (!err) {
          spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`));
          currentStep++
          resolve()
        } else {
          spinner.fail(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`));
          throw err
        }
      })
    })
  })
}

function changeConfig (choices) {
  spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`));
  return new Promise((resolve) => {
    fs.readFile(`${process.cwd()}/${program.init}/docs/.vuepress/config.js`, (err, data) => {
      if (err) throw err;
      const _data = eval(data.toString())
      _data.themeConfig.type = 'blog'
      _data.themeConfig.author = choices.author
      _data.title = choices.title
      _data.description = choices.description
      let str = `module.exports = ${JSON.stringify(_data, null, 2)}`
      fs.writeFile(`${process.cwd()}/${program.init}/docs/.vuepress/config.js`, str, function (err) {
        if (!err) {
          spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`));
          resolve()
        } else {
          spinner.fail(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`));
          throw err
        }
      })
    })
  })
}

