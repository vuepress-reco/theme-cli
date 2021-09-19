const inquirer = require('inquirer')

const isNewDirQuestions = {
  name: 'isNewDir',
  type: 'confirm',
  message: `Whether to create a new directory?`,
  default: 'Y'
}

const newDirQuestion = {
  name: 'newDir',
  type: 'input',
  message: `What's the name of new directory?`
}

let questions = [
  {
    name: 'title',
    type: 'input',
    message: `What's the title of your project?`
  },
  {
    name: 'description',
    type: 'input',
    message: `What's the description of your project?`
  },
  {
    name: 'author',
    type: 'input',
    message: `What's the author's name?`
  },
  {
    name: 'style',
    type: 'list',
    message: `What style do you want your home page to be?(The 2.x version is the alpha version)`,
    choices: ['blog', 'doc', '2.x'],
    filter: function (val: any) {
      return val.toLowerCase()
    }
  }
]

module.exports = async function handleInquirer (isString: boolean, dir: string) {
  let isNewDir = false
  let newDir = './'
  if (!isString) {
    isNewDir = (await inquirer.prompt(isNewDirQuestions)).isNewDir
    if (isNewDir) {
      questions = [
        newDirQuestion,
        ...questions
      ]
    }
  } else {
    newDir = dir
  }

  return new Promise((resolve, reject) => {
    inquirer
      .prompt(questions)
      .then((answers: any) => {
        resolve({ isNewDir, newDir, ...answers })
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}
