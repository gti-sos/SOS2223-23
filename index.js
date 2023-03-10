//______________________Requires________________________

var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var csvdata = require('csvdata');
var rvr = require('./samples/rvr');
const ppo = require('./samples/ppo.js');
const amjc = require('./samples/amjc');

//______________________Variables_________________________
var app = express();
var port = process.env.PORT || 12345;
//______________________URL_________________________
const BASE_API_URL = '/api/v1'
//_______________________Main______________________________
app.use(bodyParser.json());

//__________________Ricardo___________________
app.get('/samples/rvr', (req, res)=>{
    let province = 'Almeria';
    let attributeName = 'n_cont_indef'
    csvdata.load('./data/datos_rvr.csv').then((datos) => {
        let media = rvr(province, attributeName, datos);
        res.json(`El valor de la media de los datos ${attributeName} para la provincia ${province} es: ${media}`);
    }).catch((error) => {
        res.json(error);
    });
    console.log('New Request to /samples/rvr');
});

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