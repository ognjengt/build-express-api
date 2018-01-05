const assert  = require('chai').assert;
var helpers   = require('../bin/helpers');
const fs      = require('fs');
var chai      = require('chai');
var expect = chai.expect;
const { getInstalledPathSync }  = require('get-installed-path');

chai.use(require('chai-fs'));
var globalModulePath = getInstalledPathSync('build-express-api');

var configText = `{
  "serverPath": "./rest/server.js",
  "controllersPath": "./rest/controllers",
  "modelsPath": "./rest/models",
  
  "schema": {
    "controllers": [
      {
        "name": "controller1",
        "routes": "plain"
      },
      {
        "name": "controller2",
        "routes": {
          "getPosts": "GET",
          "createNew": "POST"
        }
      }
    ],
    "models": [
      {
        "name": "User",
        "props": "username: String, password: String"
      },
      {
        "name": "Post",
        "props": "title: String"
      }
    ] 
  }

}`

function createTestConfig(configText) {
  fs.writeFileSync('beaConfig.json', configText);
}

describe('Helpers', function() {

  /**
   * [✔️] Should create beaConfig.json
   */
  describe('helpers.createBeaConfig', function() {

    it('should create beaConfig.json', function() {
      let result = helpers.createBeaConfig();

      expect('./beaConfig.json').to.be.a.path();
      assert.pathExists('./beaConfig.json');
    })

  })

  /**
   * [✔️] Should load beaConfig.json in JSON format and contains specific keys
   */
  describe('helpers.loadBeaConfig', function() {

    it('should load beaConfig.json in JSON format and contains specific keys',function() {
      let result = helpers.loadBeaConfig();

      expect(result).to.be.an('object').that.has.any.keys('serverPath', 'controllersPath', 'modelsPath'); // find a way to test that this contains ALL of the given keys, when I put .all.keys, it checks that it must have ONLY that keys, I don't wan't that.
    })

  })
  
  /**
   * [✔️] Should return property that is requested, if beaConfig.json contains the passed property key
   * [✔️] Should return null if the passed property does not exist in beaConfig.json
   */
  describe('helpers.getProperty', function() {

    // Setup
    createTestConfig(configText);

    it('Should return property that is requested, if beaConfig.json contains the passed property key', function() {
      let result = helpers.getProperty('schema');
      assert.notEqual(result,null);
    })

    it('Should return null if the passed property does not exist in beaConfig.json', function() {

      let result = helpers.getProperty('nonExistingProp');
      assert.equal(result,null);
    })

  })
  /**
   * [✔️] For given property 'schema' should return the value that is object, and contains controllers and models keys
   */
  describe('helpers.validateSchema', function() {

    // Setup
    createTestConfig(configText);

    it('For given property "schema" should return the value that is object, and contains controllers and models arrays', function() {
      let result = helpers.getProperty('schema');
      let validation = helpers.validateSchema(result);

      expect(result).to.be.an('object').that.has.all.keys('controllers','models');
      expect(result.controllers).to.be.an('array');
      expect(result.models).to.be.an('array');
      assert.equal(validation,true);
    })

  })

})