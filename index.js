//______________________Requires________________________

import express from 'express';
import { rvr } from './backend/rvr.js';
import { ppo }  from'./backend/ppo.js';
import { amjc } from './backend/amjc.js';
import { handler } from "./frontend/build/handler.js"


//______________________Variables_________________________

var app = express();

var port = process.env.PORT || 12345;

// const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________

app.use(express.json());

rvr(app); //Ricardo

ppo(app); //Pablo

amjc(app); //Agustín

app.use(handler);

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});