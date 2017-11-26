var express     = require('express');
var bodyParser  = require('bodyParser');
var app         = express(); // Please do not remove this line, since CLI uses this line as guidance to import new controllers

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});