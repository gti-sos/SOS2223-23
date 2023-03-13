//______________________Requires________________________

var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var rvr = require('./samples/rvr.js');
var ppo = require('./samples/ppo');
var amjc = require('./samples/amjc');

//______________________Variables_________________________

var app = express();

var port = process.env.PORT || 12345;

const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________

app.use(bodyParser.json());

rvr(app); //Ricardo

ppo.api(app); //Pablo

amjc.api(app); //Agustín

app.get('/cool', (req, res) => {
    res.json(cool());
    console.log('New request to /faces');
});

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});