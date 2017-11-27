const createControllerQs = [
  {
    type: 'input',
    name: 'controllerName',
    message: 'Controller name: '
  },
  {
    type: 'list',
    name: 'controllerType',
    message: 'Controller type: ',
    choices: [
      'Plain (Sample controller with 2 routes)',
      'Custom routes'
    ]
  }
];

const customRouteQs = [
  {
    type: 'input',
    name: 'customRoutes',
    message: 'Enter routes in JSON format { "routeName": "METHOD", }: '
  }
];

const createModelQs = [
  {
    type: 'input',
    name: 'modelName',
    message: 'Model name: '
  },
  {
    type: 'input',
    name: 'modelProps',
    message: 'Enter model properties ( eg. username: String, ):'
  }
]

const questions = {
  createControllerQs,
  customRouteQs,
  createModelQs
}

module.exports = questions;