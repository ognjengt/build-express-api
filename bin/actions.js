// Implementations of actions
const fs = require('fs');

var actions = {};

actions.init = () => {
  console.log('Init');
}

actions.createController = (controllerName) => {
  console.log(controllerName);
}

module.exports = actions;