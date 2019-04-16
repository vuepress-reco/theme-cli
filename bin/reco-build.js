#! /usr/bin/env node

import package from '../package.json'

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

program
  .version(package.version)
  .option('-i, init [name]', '初始化reco-build项目')
  .option('-v, version [version]', '初始化reco-build项目')
  .parse(process.argv);

if (program.init) {
  const spinner = ora('正在从github下载reco-build').start();
  download('recoluan/vuepress-theme-reco', program.init, function (err) {
    if(!err){
      // 可以输出一些项目成功的信息
      console.info(chalk.blueBright('下载成功'));
    }else{
      // 可以输出一些项目失败的信息
      console.info(chalk.redBright('下载失败'));
      console.info(err)
    }
  })
}  