// Implementations of actions
const fs      = require('fs');
const config  = require('./config');

var actions = {};

/**
 * Initializes the current directory with all the files needed.
 * @param {*String} appName 
 */
actions.init = (appName) => {
  var initSuccessful = true;
  if(!fs.existsSync('./rest')) {
    // Create folder structure
    fs.mkdirSync('./rest');
    fs.mkdirSync('./rest/models');
    fs.mkdirSync('./rest/controllers');
    // Create package.json
    if(!fs.existsSync('package.json')) {
      var packageJsonText = fs.readFileSync('../templates/packageTemplate.json');

      packageJsonText = packageJsonText.toString().replace('$appName',appName);

      fs.writeFileSync('package.json',packageJsonText);
    }
    else initSuccessful = false;

    // Create server.js
    if(!fs.existsSync('./rest/server.js')) {
      var serverText = fs.readFileSync('../templates/serverTemplate.js');
      
      // replace needed text

      fs.writeFileSync('./rest/server.js',serverText);
    }
    else initSuccessful = false;

    
  }
  else initSuccessful = false;

  if(initSuccessful) {
    // Print succesfull
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ Initialization successful');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white,'Please do not change the name of the directories and files created by this cli, as this cli needs those directory names to know where to create models, controllers and more.');
  }
  else {
    console.log(config.terminal_colors.red,"✖ Directory 'rest' already exists."); 
    console.log(config.terminal_colors.white);
  }
}

/**
 * Creates a new api controller in rest/controllers
 * @param {*String} controllerName 
 */
actions.createController = (controllerName) => {
  console.log(controllerName+'Controller');
}

module.exports = actions;