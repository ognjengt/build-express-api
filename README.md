# Build Express Api
A Command line interface for instantly building an express rest api. <br>
Create controllers, models and add routes in matter of seconds.

[![npm version](https://badge.fury.io/js/build-express-api.svg)](https://badge.fury.io/js/build-express-api)

*This CLI only supports Node 6 and over.*

## Installation
Install it globally:
```sh
$ npm install -g build-express-api
```
## Getting Started
### Initializing the application structure
```sh
$ mkdir my-app
$ cd my-app
$ build-express-api init
```
#### Directory structure
```
my-app
├── package.json
├── rest
    └── controllers
    └── models
    └── server.js
```
Install all the needed dependencies:
```sh
$ npm install
```
*Note: when running all of the further commands, please stay in the my-app directory*
## Creating a new controller
```sh
$ build-express-api create-controller
```
The CLI will now take you through series of questions, the example of building a new controller would be:
```sh
$ ? Controller name: authentication
$ ? Controller type:
$ > Plain (Sample controller with 4 routes)
$   Custom routes
```
You can choose the **plain controller** or **custom routes** controller from the menu. <br>
**Plain controller** just creates a controller with built in routes in rest/controllers/controllerName.js as shown in the picture below:

