const program     = require('commander');
const { prompt }  = require('inquirer');
const actions     = require('./actions');
const config      = require('./config');
const questions   = require('./questions');

program
  .version(config.cli_version)
  .description('Command line interface for instantly building an express rest api')

// Init
program
  .command('init <appName>')
  .alias('i')
  .description('Initializes the current directory with all files needed.')
  .action((appName) => {
    actions.init(appName);
  })

// Create controller
program
  .command('create-controller')
  .alias('cc')
  .description('Creates a new api controller in rest/controllers/')
  .action(() => {
    prompt(questions.createControllerQs).then(answer => actions.createController(answer.controllerName));
  })

program.parse(process.argv);