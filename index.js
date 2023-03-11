//______________________Requires________________________

var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var csvdata = require('csvdata');
var rvr_backend = require('./samples/rvr.js');
var ppo = require('./samples/ppo');
var amjc = require('./samples/amjc');

//______________________Variables_________________________

var app = express();

var port = process.env.PORT || 12345;

const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________
app.use(bodyParser.json());

rvr_backend(app);

//__________________Pablo_____________________
ppo.api(app);

//__________________Agustín___________________
amjc.api(app);

//____________________________________________

app.get('/cool', (req, res) => {
    res.json(cool());
    console.log('New request to /faces');
});

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});