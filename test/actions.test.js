const assert  = require('chai').assert;
const actions = require('../bin/actions');
const fs      = require('fs');
var chai      = require('chai');
var expect = chai.expect;

chai.use(require('chai-fs'));

const controllerName1 = 'test';
const controllerName2 = 'test1Controller';
const controllerName3 = 'test2';
const controllerName4 = 'test3';
const controllerName5 = 'test4';

const customRoutesControllerName1 = 'customTest';
const customRoutesControllerName2 = 'customTest1Controller';
const customRoutesControllerName3 = 'customTest2';
const customRoutesControllerName4 = 'customTest3';
const customRoutesControllerName5 = 'customtest4';

const customRoutes1 = '{"route1":"GET","route2":"POST"}';
const customRoutes2 = '{"route1":"POST","route2":"GET","route3":"gEt","route4":"pOsT","route5":"get","route6":"post"}';

const unExistingController = 'test150';
const addRoutes1 = '{"addRoute1":"GET","addRoute2":"POST"}';

const modelName1 = 'Testmodel';
const modelName2 = 'Testmodel1';
const modelName3 = 'Testmodel2';
const modelName4 = 'Testmodel3';

const model1Props = 'prop1: String, prop2: Boolean, prop3: Number';

describe('Actions',function() {
  /**
   * [✔️] Should return true if folder structure does not exits
   * [✔️] Should create folder structure if it does not exist
   * [✔️] Server.js should match serverTemplate
   */
  describe('actions.init tests', function() {
    it('should return true if folder structure does not exist', function() {
      if(!fs.existsSync('./rest')) {
        let result = actions.init();
        assert.equal(result,true);
      }
    })

    it('should create folder structure if it does not exist', function() {
      let result = actions.init();
      expect('./rest').to.be.a.directory();
      assert.pathExists('./rest');

      expect('./rest/controllers').to.be.a.directory();
      assert.pathExists('./rest/controllers');

      expect('./rest/models').to.be.a.directory();
      assert.pathExists('./rest/models');

      expect('./rest/server.js').to.be.a.path();
      assert.pathExists('./rest/server.js');
    })

    it('Server.js should match the serverTemplate.js',function() {
      let serverTemplate = fs.readFileSync('./templates/serverTemplate.js').toString();

      let createdServer = fs.readFileSync('./rest/server.js').toString();

      assert.equal(serverTemplate,createdServer);
    })
  })
  /**
   * Test the createPlainController to:
   * [✔️] Creates a controller inside ./rest/controllers 
   * [✔️] Creates a controller if the controller name contains the word 'Controller'
   * [✔️] Controller contains the required template
   * [✔️] Does not create a controller if it already exists
   * [✔️] Server.js implements controller settings
   */
  describe('actions.createPlainController tests', function() {
    it('should create plain controller in ./rest/controllers/',function() {
      let result = actions.createPlainController(controllerName1);
      let pathToController = './rest/controllers/'+controllerName1+'Controller.js';

      expect(pathToController).to.be.a.path();
      assert.pathExists(pathToController);
    })

    it('should create plain controller in ./rest/controllers/ if the controller name contains the word `Controller`', function() {
      let result = actions.createPlainController(controllerName2);
      let pathToController = './rest/controllers/'+controllerName2+'.js';

      expect(pathToController).to.be.a.path();
      assert.pathExists(pathToController);
    })

    it('should contain required template',function() {
      let result = actions.createPlainController(controllerName3);
      let pathToController = './rest/controllers/'+controllerName3+'Controller.js';

      let controllerContents = fs.readFileSync(pathToController).toString();
      let templateContents = fs.readFileSync('./templates/plainControllerTemplate.js').toString();
      let expectedContents = templateContents.toString().replace(new RegExp('{{controllerName}}','g'), controllerName3);

      assert.equal(controllerContents,expectedContents);
    })

    it('should not create a controller if it already exists',function() {
      let firstCreation = actions.createPlainController(controllerName4);
      let secondCreation = actions.createPlainController(controllerName4);

      assert.equal(secondCreation,false);
    })

    it('Server.js should contain controller that was created',function() {
      let result = actions.createPlainController(controllerName5);

      let serverContents = fs.readFileSync('./rest/server.js').toString();
      let includes1 = serverContents.includes(`var ${controllerName5}Controller = require('./controllers/${controllerName5}Controller');`);
      let includes2 = serverContents.includes(`app.use('/api/${controllerName5}', ${controllerName5}Controller);`);

      assert.equal(includes1,true);
      assert.equal(includes2,true);
    })
  })

  /**
   * [✔️] Should create a controller inside './rest/controllers/'
   * [✔️] Creates a controller if the controller name contains the word 'Controller'
   * [✔️] Controller contains the required routes
   * [✔️] Does not create a controller if it already exists
   * [✔️] Server.js implements controller settings
   */
  describe('actions.createControllerWithCustomRoutes tests',function() {
    it('should create a controller in ./rest/controllers/',function() {
      let result = actions.createControllerWithCustomRoutes(customRoutesControllerName1,JSON.parse(customRoutes1));
      let pathToController = './rest/controllers/'+customRoutesControllerName1+'Controller.js';

      expect(pathToController).to.be.a.path();
      assert.pathExists(pathToController);
    })

    it('should create a custom routes controller in ./rest/controllers/ if the controller name contains the word `Controller`', function() {
      let result = actions.createControllerWithCustomRoutes(customRoutesControllerName2,JSON.parse(customRoutes1));
      let pathToController = './rest/controllers/'+customRoutesControllerName2+'.js';

      expect(pathToController).to.be.a.path();
      assert.pathExists(pathToController);
    })

    it('should properly contain the routes provided', function() {
      let parsed = JSON.parse(customRoutes2);
      let result = actions.createControllerWithCustomRoutes(customRoutesControllerName3, parsed);
      let pathToController = './rest/controllers/'+customRoutesControllerName3+'Controller.js';

      let controllerContents = fs.readFileSync(pathToController).toString();
      let containsAll = true;
      let routesString = '';
            // Go through all of the routes and create them
      for(let prop in parsed) {
        let lowercaseProp = prop.toLowerCase();
        let lowercaseMethod = parsed[prop].toLowerCase();

        routesString = `router.${lowercaseMethod}('/${lowercaseProp}',(req,res)`;
        if (!controllerContents.includes(routesString)) {
          containsAll = false; break;
        }

      }

      assert.equal(containsAll,true);
    })

    it('should not create a controller if it already exists',function() {
      let firstCreation = actions.createControllerWithCustomRoutes(customRoutesControllerName4,JSON.parse(customRoutes1));
      let secondCreation = actions.createControllerWithCustomRoutes(customRoutesControllerName4,JSON.parse(customRoutes1));

      assert.equal(secondCreation,false);
    })

    it('Server.js should contain controller that was created',function() {
      let result = actions.createControllerWithCustomRoutes(customRoutesControllerName5, JSON.parse(customRoutes1));

      let serverContents = fs.readFileSync('./rest/server.js').toString();
      let includes1 = serverContents.includes(`var ${customRoutesControllerName5}Controller = require('./controllers/${customRoutesControllerName5}Controller');`);
      let includes2 = serverContents.includes(`app.use('/api/${customRoutesControllerName5}', ${customRoutesControllerName5}Controller);`);

      assert.equal(includes1,true);
      assert.equal(includes2,true);
    })
    
  })

  /**
   * [✔️] Provided controller contains the provided routes
   * [✔️] Does not create routes if the provided controller does not exist
   * 
   */
  describe('actions.addRoutes tests', function() {

    it('should add the provided routes to the provided controller', function() {
      let parsed = JSON.parse(addRoutes1);
      let result = actions.addRoutes(controllerName1,parsed);
      let controllerContents = fs.readFileSync('./rest/controllers/'+controllerName1+'Controller.js');

      let containsAll = true;
      let routesString = '';
            // Go through all of the routes and create them
      for(let prop in parsed) {
        let lowercaseProp = prop.toLowerCase();
        let lowercaseMethod = parsed[prop].toLowerCase();

        routesString = `router.${lowercaseMethod}('/${lowercaseProp}',(req,res)`;
        if (!controllerContents.includes(routesString)) {
          containsAll = false; break;
        }

      }
      assert.equal(containsAll,true);
    })

    it('should not add routes to unexisting controller', function() {
      let result = actions.addRoutes(unExistingController,JSON.parse(addRoutes1));
      assert.equal(result,false);
    })
  })

  /**
   * [✔️] Should create a model in ./rest/models and return true
   * [✔️] Should not create a model if the model with the same name already exists
   * [✔️] Should match the modelTemplate.js and should contain all of the properties
   */
  describe('actions.createModel',function() {

    it('should create a model in ./rest/models and return true', function() {
      let result = actions.createModel(modelName1,model1Props);
      let pathToModel = './rest/models/'+modelName1+'.js';

      expect(pathToModel).to.be.a.path();
      assert.pathExists(pathToModel);
      assert.equal(result,true);
    })

    it('should not create a model if the model with the same name already exists', function() {
      let firstCreation = actions.createModel(modelName2,model1Props);
      let secondCreation = actions.createModel(modelName2,model1Props);

      assert.equal(secondCreation,false);
    })

    it('should match the modelTemplate.js and should contain all of the properties', function() {
      let result = actions.createModel(modelName3,model1Props);
      let pathToModel = './rest/models/'+modelName3+'.js';

      let modelContents = fs.readFileSync(pathToModel).toString();
      let templateContents = fs.readFileSync('./templates/modelTemplate.js').toString();
      let expectedContents = templateContents.toString().replace(new RegExp('modelname','g'), modelName3);

      let props = model1Props;

      props = props.replace(new RegExp(',', 'g'), ',\n ');
      props = props.replace(new RegExp('{', 'g'), '{\n   ');
      props = props.replace(new RegExp('}', 'g'), '\n }');
      expectedContents = expectedContents.replace('PROPS',props);


      assert.equal(modelContents,expectedContents);
    })
  })

})