// $controllerName controller routes
var express = require('express');
var router = express.Router();

// GET /api/$controllerName/
router.get('/',(req,res) => {
  res.send('GET response');
});

// POST /api/$controllerName/
router.post('/',(req,res) => {
  res.send('POST response');
});

module.exports = router;