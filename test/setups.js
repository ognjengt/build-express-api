const fs      = require('fs');

var setups = {};
setups.configText = `{
  "serverPath": "./rest/server.js",
  "controllersPath": "./rest/controllers",
  "modelsPath": "./rest/models",
  
  "schema": {
    "controllers": [
      {
        "name": "schema1",
        "routes": "plain"
      },
      {
        "name": "schema2",
        "routes": {
          "getPosts": "GET",
          "createNew": "POST"
        }
      }
    ],
    "models": [
      {
        "name": "User1",
        "props": "username: String, password: String"
      },
      {
        "name": "Post1",
        "props": "title: String"
      }
    ] 
  }

}`

setups.createTestConfig = (configText) => {
  fs.writeFileSync('beaConfig.json', configText);
}

module.exports = setups;