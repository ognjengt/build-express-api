// Implementations of actions
const fs                        = require('fs');
const config                    = require('./config');
const { getInstalledPathSync }  = require('get-installed-path');
const helpers                   = require('./helpers');

var actions = {};

var globalModulePath = getInstalledPathSync('build-express-api');

/**
 * Initializes the current directory with all the files needed.
 */
actions.init = () => {
  var initSuccessful = true;
  if(!fs.existsSync('./rest')) {
    // Create folder structure
    fs.mkdirSync('./rest');
    fs.mkdirSync('./rest/models');
    fs.mkdirSync('./rest/controllers');
    // Create package.json
    if(!fs.existsSync('package.json')) {
      var packageJsonText = fs.readFileSync(globalModulePath+'/templates/packageTemplate.json');

      fs.writeFileSync('package.json',packageJsonText);
    }

    // Create server.js
    var serverText = fs.readFileSync(globalModulePath+'/templates/serverTemplate.js');

    fs.writeFileSync('./rest/server.js',serverText);

    helpers.createBeaConfig();
  }
  else initSuccessful = false;

  if(initSuccessful) {
    // Print succesfull
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ Initialization successful');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white, 'Please check beaConfig.js if you want a different folder structure, provide the path to the server.js/app.js, controllers/routes folder and models folder.');
    return true;
  }
  else {
    console.log(config.terminal_colors.red,"✖ Directory 'rest' already exists."); 
    console.log(config.terminal_colors.white);
    return false;
  }
}

/**
 * Creates a new plain api controller in rest/controllers with get and post
 * @param {*String} controllerName 
 */
actions.createPlainController = (controllerName) => {
  // First load the config file to know where to create controllers
  var beaConfig = helpers.loadBeaConfig();
  // If /rest/controllers doesn't exist return
  if(!fs.existsSync(beaConfig.controllersPath)) {
    console.log(config.terminal_colors.red,"✖ Missing directory "+beaConfig.controllersPath+", please check whether that directory exists.");
    console.log(config.terminal_colors.white);
    return;
  }

  var success = true;
  var fullControllerName;
  // get fullControllerName to contain Controller
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName.toLowerCase()+'Controller';
  } else fullControllerName = controllerName;

  // Only create controller if it doesn't exist already
  if(!fs.existsSync(beaConfig.controllersPath+'/'+fullControllerName+'.js')) {
    var plainControllerText = fs.readFileSync(globalModulePath+'/templates/plainControllerTemplate.js');
    
    // get plain controller name eg foodController -> food
    var routeName = fullControllerName.replace('Controller','');

    plainControllerText = plainControllerText.toString().replace(new RegExp('{{controllerName}}','g'), routeName);

    // Create controller
    fs.writeFileSync(beaConfig.controllersPath+'/'+fullControllerName+'.js',plainControllerText);

    // Use this controller in server.js
    var serverText = fs.readFileSync(beaConfig.serverPath).toString();
    var arrayOfLines = serverText.split("\n");
    var index;
    arrayOfLines.forEach((line,i) => {
      if(line.includes('= express();')) {
        index = i;
      }
    })
    arrayOfLines.splice(++index,0,"\n");
    arrayOfLines.splice(++index,0,"var "+ fullControllerName + " = require('"+beaConfig.controllersPath+"/"+fullControllerName+"');");
    arrayOfLines.splice(++index,0,"app.use('/api/"+routeName+"', "+fullControllerName+");");

    var newServerText = arrayOfLines.join('\n');
    fs.writeFileSync(beaConfig.serverPath,newServerText);

  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check '+beaConfig.controllersPath+'/'+fullControllerName+'.js');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
    return true;
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
    return false;
  }

}

/**
 * 
 * @param {*String} controllerName 
 * @param {*Object} routes 
 */
actions.createControllerWithCustomRoutes = (controllerName, routes) => {
  // First load the config file to know where to create controllers
  var beaConfig = helpers.loadBeaConfig();
  
  if(!fs.existsSync(beaConfig.controllersPath)) {
    console.log(config.terminal_colors.red,"✖ Missing directory "+beaConfig.controllersPath+", please check whether that directory exists.");
    console.log(config.terminal_colors.white);
    return;
  }

  var success = true;
  var fullControllerName;
  // get fullControllerName to contain Controller
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName.toLowerCase()+'Controller';
  } else fullControllerName = controllerName;

  // Only create controller if it doesn't exist already
  if(!fs.existsSync(beaConfig.controllersPath+'/'+fullControllerName+'.js')) {

      var basicControllerName = fullControllerName.replace('Controller','');
      var routesString = '';
    
      // Go through all of the routes and create them
      for(var prop in routes) {
        var lowercaseProp = prop.toLowerCase();
        var lowercaseMethod = routes[prop].toLowerCase();

        routesString += `// ${lowercaseMethod} /api/${basicControllerName}/${lowercaseProp}
router.${lowercaseMethod}('/${lowercaseProp}',(req,res) => {
  
});

`;
      }

      // Push the routes in the rest
      var routesControllerText = `// ${basicControllerName} controller routes
var express = require('express');
var router = express.Router();

${routesString}
module.exports = router;
`;

      fs.writeFileSync(beaConfig.controllersPath+'/'+fullControllerName+'.js',routesControllerText);

      // Use this controller in server.js
      var serverText = fs.readFileSync(beaConfig.serverPath).toString();
      var arrayOfLines = serverText.split("\n");
      var index;
      arrayOfLines.forEach((line,i) => {
        if(line.includes('= express();')) {
          index = i;
        }
      })
      arrayOfLines.splice(++index,0,"\n");
      arrayOfLines.splice(++index,0,"var "+ fullControllerName + " = require('"+beaConfig.controllersPath+"/"+fullControllerName+"');");
      arrayOfLines.splice(++index,0,"app.use('/api/"+basicControllerName+"', "+fullControllerName+");");
  
      var newServerText = arrayOfLines.join('\n');
      fs.writeFileSync(beaConfig.serverPath,newServerText);
  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check '+beaConfig.controllersPath+'/'+fullControllerName+'.js');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
    return true;
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
    return false;
  }

}

/**
 * Adds the routes to the controller provided
 * @param {*String} controllerName 
 * @param {*Object} routes 
 */
actions.addRoutes = (controllerName,routes) => {
  // First load the config file to know where to create controllers
  var beaConfig = helpers.loadBeaConfig();

  var fullControllerName;
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName+'Controller';
  } else fullControllerName = controllerName;

  if(!fs.existsSync(beaConfig.controllersPath+'/'+fullControllerName+'.js')) {
    console.log(config.terminal_colors.red,"✖ Controller with that name ("+fullControllerName+") doesn't exist, please chect "+beaConfig.controllersPath+" and provide an existing controller.");
    console.log(config.terminal_colors.white);
    return false;
  }

  var routesString = '';
  var basicControllerName = fullControllerName.replace('Controller','');

  console.log(routesString);
  // Go through controller.js and add routes to the end
  var controllerText = fs.readFileSync(beaConfig.controllersPath+'/'+fullControllerName+'.js').toString();
  var arrayOfLines = controllerText.split("\n");
  var index;
  arrayOfLines.forEach((line,i) => {
    if(line.includes('module.exports = router')) {
      index = i;
    }
  })
  // Go through all of the routes and create them
  for(var prop in routes) {
    var lowercaseProp = prop.toLowerCase();
    var lowercaseMethod = routes[prop].toLowerCase();

    arrayOfLines.splice(index,0,`// ${lowercaseMethod} /api/${basicControllerName}/${lowercaseProp}`);
    arrayOfLines.splice(++index,0,`router.${lowercaseMethod}('/${lowercaseProp}',(req,res) => {`);
    arrayOfLines.splice(++index,0," ");
    arrayOfLines.splice(++index,0,'});\n');
    index++;
  }
  var newControllerText = arrayOfLines.join('\n');
  fs.writeFileSync(beaConfig.controllersPath+'/'+fullControllerName+'.js',newControllerText);
  
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.green,'✔ Routes added successfully, check '+beaConfig.controllersPath+'/'+fullControllerName+'.js');
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.white);
  return true;
}

/**
 * Creates new model in rest/models
 * @param {*String} name 
 * @param {*String} props 
 */
actions.createModel = (name,props) => {

  // First load the config file to know where to create controllers
  var beaConfig = helpers.loadBeaConfig();
  
  if(!fs.existsSync(beaConfig.modelsPath)) {
    console.log(config.terminal_colors.red,"✖ Missing directory"+beaConfig.modelsPath+", please check whether that directory exists.");
    console.log(config.terminal_colors.white);
    return false;
  }
  name = name.charAt(0).toUpperCase() + name.slice(1);

  if (fs.existsSync(beaConfig.modelsPath+'/'+name+'.js')) {
    console.log(config.terminal_colors.red,"✖ Model with that name already exists.");
    console.log(config.terminal_colors.white);
    return false;
  }

  var modelTemplateText = fs.readFileSync(globalModulePath+'/templates/modelTemplate.js').toString();
  modelTemplateText = modelTemplateText.replace(new RegExp('modelname','g'), name);
  props = props.replace(new RegExp(',', 'g'), ',\n ');
  props = props.replace(new RegExp('{', 'g'), '{\n   ');
  props = props.replace(new RegExp('}', 'g'), '\n }');
  modelTemplateText = modelTemplateText.replace('PROPS',props);

  fs.writeFileSync(beaConfig.modelsPath+'/'+name+'.js',modelTemplateText);

  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.green,'✔ Model '+name+' created successfully, check '+beaConfig.modelsPath+'/'+name+'.js');
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.white);
  return true;
}

/**
 * Creates beaConfig.json in root directory
 */
actions.createConfig = () => {
  var created = helpers.createBeaConfig();
  if (!created) {
    console.log(config.terminal_colors.red,"✖ beaConfig.json already exists");
    console.log(config.terminal_colors.white);
  }
  else {
    console.log(config.terminal_colors.green,'✔ Created beaConfig.json');
    console.log(config.terminal_colors.white);
  }
  return created;
}

module.exports = actions;