#! /usr/bin/env node

interface Choices {
  title: string,
  author: string,
  description: string,
  style: string,
  isNewDir?: string,
  newDir?: string
}

interface Spinner {
  start: Object,
  stop: Object,
  succeed: Object,
  fail: Object
}

const program = require('commander')
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')
const fs = require('fs')

const handleInquirer = require('./inquirer.js')
const spinner = ora()

let stepNum = 3
let currentStep = 1

program
  .version('1.0.0')
  .option('-i, init [name]', '初始化 vuepress-theme-reco 主题博客')
  .parse(process.argv)

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ reco-cli init my-blog')
  console.log()
})

if (program.init) {
  const isString = typeof program.init === 'string'
  handleInquirer(isString, program.init)
    .then((choices: Choices) => {
      const { style, newDir } = choices
      program.init = newDir
      stepNum = style === 'afternoon-grocery' ? 1 : style === 'doc' ? 2 : 3
      const branchName = style === 'afternoon-grocery' ? 'afternoon-grocery' : '1.x'
      const gitBranch = `recoluan/vuepress-theme-reco-demo#demo/${branchName}`
      spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Load file from git`))

      download(gitBranch, program.init, function (err: Object) {
        if (!err) {
          spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Load file from git`))
          currentStep++
          handleDownload(choices)
        } else {
          spinner.fail(chalk.redBright(`[${currentStep}/${stepNum}] Load file from git`))
          console.info(err)
          spinner.stop()
        }
      })
    })
    .catch((err: Object) => {
      console.info(chalk.redBright(err))
    })
}

function handleDownload (choices: Choices) {
  if (choices.style === 'afternoon-grocery') {
    handleEnd()
    return
  }

  if (choices.style === 'doc') {
    changePackage(choices).then(() => {
      handleEnd()
    })
    return
  }

  Promise.all([changePackage(choices), changeConfig(choices)]).then(() => {
    handleEnd()
  })
}

function handleEnd () {
  spinner.stop()
  console.log()
  console.info(chalk.greenBright('Load successful, enjoy it!'))
  console.log()

  if (program.init !== './') {
    console.log(chalk.gray('# Inter your blog'))
    console.log(`$ cd ${program.init}`)
  }

  console.log(chalk.gray('# Install package'))
  console.log('$ yarn & npm install')
}

function changePackage (choices: Choices) {
  spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`))

  return new Promise((resolve) => {
    fs.readFile(`${process.cwd()}/${program.init}/package.json`, (err: Object, data: Object) => {
      if (err) throw err
      const _data = JSON.parse(data.toString())
      _data.name = choices.title
      _data.description = choices.description
      _data.version = '1.0.0'
      const str = JSON.stringify(_data, null, 2)
      fs.writeFile(`${process.cwd()}/${program.init}/package.json`, str, function (err: Object) {
        if (!err) {
          spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`))
          currentStep++
          resolve()
        } else {
          spinner.fail(chalk.blue(`[${currentStep}/${stepNum}] Edit package.json`))
          throw err
        }
      })
    })
  })
}

function changeConfig (choices: Choices) {
  spinner.start(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`))
  return new Promise((resolve) => {
    const _data = require(`${process.cwd()}/${program.init}/.vuepress/config.js`)
    _data.themeConfig.type = 'blog'
    _data.themeConfig.author = choices.author
    _data.title = choices.title
    _data.description = choices.description
    const str = `module.exports = ${JSON.stringify(_data, null, 2)}`
    fs.writeFile(`${process.cwd()}/${program.init}/.vuepress/config.js`, str, function (err: Object) {
      if (!err) {
        spinner.succeed(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`))
        currentStep++
        resolve()
      } else {
        spinner.fail(chalk.blue(`[${currentStep}/${stepNum}] Edit config.js`))
        throw err
      }
    })
  })
}
