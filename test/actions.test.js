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
const customRoutesControllerName3 = 'customTes2';
const customRoutesControllerName4 = 'customTes3';
const customRoutesControllerName5 = 'customTes4';

const customRoutes1 = '{"route1":"GET","route2":"POST"}';
const customRoutes2 = '{"route1":"POST","route2":"GET","route3":"gEt","route4":"pOsT","route5":"get","route6":"post"}';

describe('Actions',function() {
  /**
   * [✔️] Should return true if folder structure does not exits
   * [✔️] Should create folder structure if it does not exist
   * [✔️] Server.js should match serverTemplate
   */
  describe('actions.init', function() {
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
  describe('actions.createPlainController', function() {
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
   * [] Controller contains the required routes
   * [] Does not create a controller if it already exists
   * [] Server.js implements controller settings
   */
  describe('actions.createControllerWithCustomRoutes',function() {
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

    it('should contain the routes provided', function() {
      
    })
    
  })

})