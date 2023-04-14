//______________________Requires________________________

import express from 'express';
import cors from 'cors';
import { rvrv2 } from './backend/v2/rvr.js';
import { rvrv1 } from './backend/v1/rvr.js';
import { ppo }  from'./backend/v1/ppo.js';
import { ppo2 }  from'./backend/v2/ppo.js';
import { amjc } from './backend/v1/amjc.js';
import { amjc2 } from './backend/v2/amjc.js';
import { handler } from "./frontend/build/handler.js"


//______________________Variables_________________________

var app = express();

app.use(cors());

var port = process.env.PORT || 12345;

// const BASE_API_URL = '/api/v1'; //url

//_______________________Main_____________________

app.use(express.json());

rvrv1(app);

rvrv2(app); //Ricardo

ppo(app); //Pablo v1
ppo2(app); //Pablo v2

amjc(app); //Agustín
amjc2(app); //Agustín v2

app.use(handler);

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});