#!/usr/bin/env node
const program     = require('commander');
const { prompt }  = require('inquirer');
const actions     = require('./actions');
const config      = require('./config');
const questions   = require('./questions');

program
  .version(config.cli_version)
  .alias('v')
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
  .description('Creates a new api controller in the directory specified in the beaConfig.json')
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

// Add routes
program
  .command('add-routes <controllerName>')
  .alias('ar')
  .description('Adds the routes to the controller provided')
  .action((controllerName) => {
    prompt(questions.customRouteQs).then(answer => actions.addRoutes(controllerName,JSON.parse(answer.customRoutes)));
  })

// Create model
program
  .command('create-model')
  .alias('cm')
  .description('Creates new model in the directory specified in the beaConfig.json')
  .action(() => {
    prompt(questions.createModelQs).then(answers => actions.createModel(answers.modelName, answers.modelProps));
  })

program
  .command('create-config')
  .alias('cconfig')
  .description('Creates a beaConfig.json file in the root directory. Use this file to tell the CLI where to create controllers and models')
  .action(() => {
    actions.createConfig();
  })

program
  .command('build-schema')
  .alias('bs')
  .description('Creates multiple controllers and models in the directories specified in the beaConfig.json. Requires schema object in beaConfig.json')
  .action(() => {
    actions.buildSchema();
  })


program.parse(process.argv);