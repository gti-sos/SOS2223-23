//______________________Requires________________________

var express = require('express');
var bodyParser = require('body-parser');
var rvr = require('./backend/rvr.js');
var ppo = require('./backend/ppo');
var amjc = require('./backend/amjc');

//______________________Variables_________________________

var app = express();

var port = process.env.PORT || 12345;

const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________

app.use(bodyParser.json());

rvr(app); //Ricardo

ppo.api(app); //Pablo

amjc.api(app); //Agustín

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});