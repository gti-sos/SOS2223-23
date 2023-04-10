//______________________Requires________________________

import express from 'express';
import cors from 'cors';
import { rvrv2 } from './backend/rvrv2.js';
import { rvrv1 } from './backend/rvrv2.js';
import { ppo }  from'./backend/ppo.js';
import { amjc } from './backend/amjc.js';
import { handler } from "./frontend/build/handler.js";


//______________________Variables_________________________

var app = express();

app.use(cors());

var port = process.env.PORT || 12345;

// const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________

app.use(express.json());

rvrv1(app);

rvrv2(app); //Ricardo

ppo(app); //Pablo

amjc(app); //Agustín

app.use(handler);

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});