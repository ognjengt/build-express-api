const assert  = require('chai').assert;
var helpers   = require('../bin/helpers');
const fs      = require('fs');
var chai      = require('chai');
var expect = chai.expect;
const { getInstalledPathSync }  = require('get-installed-path');

chai.use(require('chai-fs'));
var globalModulePath = getInstalledPathSync('build-express-api');

describe('Helpers', function() {

  /**
   * [✔️] Should create beaConfig.json
   * [✔️] Should load beaConfig.json in JSON format and contains specific keys
   */
  describe('helpers.createConfig', function() {

    it('should create beaConfig.json', function() {
      let result = helpers.createBeaConfig();

      expect('./beaConfig.json').to.be.a.path();
      assert.pathExists('./beaConfig.json');
    })

    it('should load beaConfig.json in JSON format and contains specific keys',function() {
      let result = helpers.loadBeaConfig();

      expect(result).to.be.an('object').that.has.all.keys('serverPath', 'controllersPath', 'modelsPath');
    })

  })

})