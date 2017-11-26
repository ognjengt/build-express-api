const program     = require('commander');
const { prompt }  = require('inquirer');
const actions     = require('./actions');
const config      = require('./config');

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
    actions.createController('proba');
  })

program.parse(process.argv);