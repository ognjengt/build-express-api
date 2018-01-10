const fs                        = require('fs');
const config                    = require('./config');
const path = require('path');
var globalModulePath =  path.join(__dirname, '..')

var helpers = {};

helpers.createBeaConfig = () => {
  if (!fs.existsSync('./beaConfig.json')) {
    var configText = fs.readFileSync(globalModulePath+'/templates/configTemplate.json');

    fs.writeFileSync('beaConfig.json', configText);
    return true;
  }
  return false;
}

helpers.loadBeaConfig = () => {
  var config = fs.readFileSync('./beaConfig.json').toString();
  return JSON.parse(config);
}

helpers.getProperty = (property) => {
  var config = helpers.loadBeaConfig();
  return config[property] || null;
}

helpers.validateSchema = (schema) => {
  var validatedControllers = true;
  var validatedModels = true;

  if(schema == null) return false;

  if (schema.controllers != null) {
    if(schema.controllers instanceof Array) {
      schema.controllers.forEach(function(controller) {
        if(controller.name == "" || controller.name == null) {validatedControllers = false; return;}
        if(controller.routes == "" || controller.routes == null) {validatedControllers = false; return;}
      })
    } else validatedControllers = false;
  } else validatedControllers = false;

  if (schema.models != null) {
    if(schema.models instanceof Array) {
      schema.models.forEach(function(model) {
        if(model.name == "" || model.name == null) {validatedModels = false; return;}
        if(model.props == "" || model.props == null) {validatedModels = false; return;}
      })
    } else validatedModels = false;
  } else validatedModels = false;
  
  
  return validatedControllers || validatedModels;
}

module.exports = helpers;