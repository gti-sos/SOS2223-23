//______________________Requires________________________

var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var csvdata = require('csvdata');
var rvr_backend = require('./samples/rvr.js');
const ppo = require('./samples/ppo.js');
const amjc = require('./samples/amjc');

//______________________Variables_________________________

var app = express();

var port = process.env.PORT || 12345;

const BASE_API_URL = '/api/v1'; //url


//_______________________Main______________________________
app.use(bodyParser.json());


rvr_backend(app);

//__________________Pablo___________________
app.get('/samples/ppo', (request,response)=>{
    var provincia = "Huelva"
    var mensaje = ppo(provincia)
    response.json(mensaje)
    console.log('New Request to /samples/ppo');
});

app.get(BASE_API_URL+'/density-population', (request,response)=>{
    var mensaje = ppo()
    response.json(mensaje)
    response.status(200)
    console.log('New Request to '+ BASE_API_URL+'/density-population');
});

//__________________Agustín___________________
app.get('/samples/amjc', (request,response)=>{
    var mensaje = amjc()
    response.json(mensaje)
    console.log('New Request to /samples/amjc');
});

app.get(BASE_API_URL + '/hired-people', (request,response)=>{
    var mensaje = amjc()
    response.json(mensaje)
    console.log('New Request to /api/v1/hired-people');
});

app.get('/cool', (req, res) => {
    res.json(cool());
    console.log('New request to /faces');
});

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});