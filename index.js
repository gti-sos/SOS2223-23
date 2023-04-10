//______________________Requires________________________

import express from 'express';
import cors from 'cors';
import { rvrv2 } from './backend/rvrv2.js';
import { rvrv1 } from './backend/rvrv2.js';
import { ppo }  from'./backend/ppo.js';
import { ppo2 }  from'./backend/ppo2.js';
import { amjc } from './backend/amjc.js';
<<<<<<< HEAD
import { handler } from "./frontend/build/handler.js";
=======
import { amjc2 } from './backend/amjc2.js';
import { handler } from "./frontend/build/handler.js"
>>>>>>> c96c56707fcd9d6bbd06ba041de21e14f2344d60


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