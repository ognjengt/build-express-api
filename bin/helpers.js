const fs                        = require('fs');
const config                    = require('./config');
const { getInstalledPathSync }  = require('get-installed-path');
var globalModulePath = getInstalledPathSync('build-express-api');

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
  var validated = true;

  if(schema == null) return false;

  if(schema.controllers instanceof Array && schema.models instanceof Array) {
    schema.controllers.forEach(function(controller) {
      if(controller.name == "" || controller.name == null) {validated = false; return;}
      if(controller.routes == "" || controller.routes == null) {validated = false; return;}
    })
    
    schema.models.forEach(function(model) {
      if(model.name == "" || model.name == null) {validated = false; return;}
      if(model.props == "" || model.props == null) {validated = false; return;}
    })
  } else validated = false;
  
  return validated;
}

module.exports = helpers;