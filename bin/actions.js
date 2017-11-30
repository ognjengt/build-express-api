// Implementations of actions
const fs      = require('fs');
const config  = require('./config');

var actions = {};

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
      var packageJsonText = fs.readFileSync('../templates/packageTemplate.json');

      fs.writeFileSync('package.json',packageJsonText);
    }

    // Create server.js
    var serverText = fs.readFileSync('../templates/serverTemplate.js');

    fs.writeFileSync('./rest/server.js',serverText);

    
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
 * Creates a new plain api controller in rest/controllers with get and post
 * @param {*String} controllerName 
 */
actions.createPlainController = (controllerName) => {

  // If /rest/controllers doesn't exist return
  if(!fs.existsSync('./rest/controllers')) {
    console.log(config.terminal_colors.red,"✖ Missing directory rest/controllers, please run build-express-api init, before adding a new controller");
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
  if(!fs.existsSync('./rest/controllers/'+fullControllerName+'.js')) {
    var plainControllerText = fs.readFileSync('../templates/plainControllerTemplate.js');
    
    // get plain controller name eg foodController -> food
    var routeName = fullControllerName.replace('Controller','');

    plainControllerText = plainControllerText.toString().replace(new RegExp('{{controllerName}}','g'), routeName);

    // Create controller
    fs.writeFileSync('./rest/controllers/'+fullControllerName+'.js',plainControllerText);

    // Use this controller in server.js
    var serverText = fs.readFileSync('./rest/server.js').toString();
    var arrayOfLines = serverText.split("\n");
    var index;
    arrayOfLines.forEach((line,i) => {
      if(line.includes('= express();')) {
        index = i;
      }
    })
    arrayOfLines.splice(++index,0,"\n");
    arrayOfLines.splice(++index,0,"var "+ fullControllerName + " = require('./controllers/"+fullControllerName+"');");
    arrayOfLines.splice(++index,0,"app.use('/api/"+routeName+"',"+fullControllerName+");");

    var newServerText = arrayOfLines.join('\n');
    fs.writeFileSync('./rest/server.js',newServerText);

  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check rest/controllers/'+fullControllerName+'.js');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
  }

}

/**
 * 
 * @param {*String} controllerName 
 * @param {*Object} routes 
 */
actions.createControllerWithCustomRoutes = (controllerName, routes) => {
  if(!fs.existsSync('./rest/controllers')) {
    console.log(config.terminal_colors.red,"✖ Missing directory rest/controllers, please run build-express-api init, before adding a new controller");
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
  if(!fs.existsSync('./rest/controllers/'+fullControllerName+'.js')) {

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

      fs.writeFileSync('./rest/controllers/'+fullControllerName+'.js',routesControllerText);

      // Use this controller in server.js
      var serverText = fs.readFileSync('./rest/server.js').toString();
      var arrayOfLines = serverText.split("\n");
      var index;
      arrayOfLines.forEach((line,i) => {
        if(line.includes('= express();')) {
          index = i;
        }
      })
      arrayOfLines.splice(++index,0,"\n");
      arrayOfLines.splice(++index,0,"var "+ fullControllerName + " = require('./controllers/"+fullControllerName+"');");
      arrayOfLines.splice(++index,0,"app.use('/api/"+basicControllerName+"',"+fullControllerName+");");
  
      var newServerText = arrayOfLines.join('\n');
      fs.writeFileSync('./rest/server.js',newServerText);
  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check rest/controllers/'+fullControllerName+'.js');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
  }

}

/**
 * Adds the routes to the controller provided
 * @param {*String} controllerName 
 * @param {*Object} routes 
 */
actions.addRoutes = (controllerName,routes) => {

  var fullControllerName;
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName+'Controller';
  }
  if(!fs.existsSync('./rest/controllers/'+fullControllerName+'.js')) {
    console.log(config.terminal_colors.red,"✖ Controller with that name doesn't exist, please chect /rest/controllers and provide an existing controller.");
    console.log(config.terminal_colors.white);
    return;
  }

  var routesString = '';
  var basicControllerName = fullControllerName.replace('Controller','');

  console.log(routesString);
  // Go through controller.js and add routes to the end
  var controllerText = fs.readFileSync('./rest/controllers/'+fullControllerName+'.js').toString();
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
  fs.writeFileSync('./rest/controllers/'+fullControllerName+'.js',newControllerText);
  
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.green,'✔ Routes added successfully, check rest/controllers/'+fullControllerName+'.js');
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.white);
}

/**
 * Creates new model in rest/models
 * @param {*String} name 
 * @param {*String} props 
 */
actions.createModel = (name,props) => {
  
  if(!fs.existsSync('./rest/models')) {
    console.log(config.terminal_colors.red,"✖ Missing directory rest/models, please run build-express-api init, before adding a new model");
    console.log(config.terminal_colors.white);
    return;
  }
  name = name.charAt(0).toUpperCase() + name.slice(1);

  if (fs.existsSync('./rest/models/'+name+'.js')) {
    console.log(config.terminal_colors.red,"✖ Model with that name already exists.");
    console.log(config.terminal_colors.white);
    return;
  }

  var modelTemplateText = fs.readFileSync('../templates/modelTemplate.js').toString();
  modelTemplateText = modelTemplateText.replace(new RegExp('modelname','g'), name);
  props = props.replace(new RegExp(',', 'g'), ',\n ');
  props = props.replace(new RegExp('{', 'g'), '{\n   ');
  props = props.replace(new RegExp('}', 'g'), '\n }');
  modelTemplateText = modelTemplateText.replace('PROPS',props);

  fs.writeFileSync('./rest/models/'+name+'.js',modelTemplateText);

  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.green,'✔ Model '+name+' created successfully, check rest/models/'+name+'.js');
  console.log(config.terminal_colors.green,'----------------------------');
  console.log(config.terminal_colors.white);
}

module.exports = actions;