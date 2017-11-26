// {{controllerName}} controller routes
var express = require('express');
var router = express.Router();

// get /api/{{controllerName}}/
router.get('/',(req,res) => {
  res.send('GET response');
});

// post /api/{{controllerName}}/
router.post('/',(req,res) => {
  res.send('POST response');
});

// put /api/{{controllerName}}/
router.put('/',(req,res) => {
  res.send('PUT response');
});

// delete /api/{{controllerName}}/
router.delete('/',(req,res) => {
  res.send('DELETE response');
});

module.exports = router;