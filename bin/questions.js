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
    message: 'Enter routes in format { "routeName": "METHOD", }: '
  }
]

const questions = {
  createControllerQs,
  customRouteQs
}

module.exports = questions;