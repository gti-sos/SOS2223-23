//______________________Requires________________________

var express = require('express');
var cool = require('cool-ascii-faces');
var bodyParser = require('body-parser');
var csvdata = require('csvdata');
var rvr = require('./samples/rvr');
const ppo = require('./index-ppo.js')

//______________________Variables_________________________
var app = express();
var port = process.env.PORT || 12345;

//_______________________Main______________________________
app.use(bodyParser.json());

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

app.get('/samples/ppo', (request,response)=>{
    var mensaje = ppo()
    response.json(mensaje)
    console.log('New Request to /samples/ppo');
});


app.get('/cool', (req, res) => {
    res.json(cool());
    console.log('New request to /faces');
});

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});