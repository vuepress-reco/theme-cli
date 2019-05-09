const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'version',
    message: 'Which version you need?',
    choices: ['1.x', '0.x'],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
]

const handleInquirer = function () {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt(questions)
      .then(answers => {
        resolve(answers.version)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = handleInquirer
