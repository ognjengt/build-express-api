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
  .command('init')
  .alias('i')
  .description('Initializes the current directory with all files needed.')
  .action(() => {
    actions.init();
  })

// Create controller
program
  .command('create-controller')
  .alias('cc')
  .description('Creates a new api controller in rest/controllers/')
  .action(() => {
    prompt(questions.createControllerQs).then(answers => {
      if(answers.controllerType == 'Custom routes') {
        prompt(questions.customRouteQs).then(answer => actions.createControllerWithCustomRoutes(answers.controllerName,JSON.parse(answer.customRoutes)));
      }
      else{
        actions.createPlainController(answers.controllerName);
      }
    });
  })

program.parse(process.argv);