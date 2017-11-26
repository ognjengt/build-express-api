var express     = require('express');
var bodyParser  = require('bodyParser');
var app         = express();

// Get controllers (routes)


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use controllers (routes)


app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});