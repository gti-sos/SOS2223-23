const ppo_samples = require('./pposamples');
const BASE_API_URL = "/api/v1";
var Datastore = require(`nedb`);
var db = new Datastore();

module.exports = {     
    api: (app) => {
        //Todos los GET
            //GET a samples
        app.get('/samples/ppo', (request,response)=>{
            var provincia = "Huelva";
            var mensaje = ppo_samples.funcion(provincia);
            response.json(mensaje);
            console.log('New Request to /samples/ppo');
        });
            //GET total y querys
        app.get(BASE_API_URL+'/density-population', (request,response)=>{
            var year = request.query.year;
            var province = request.query.province;
            var gender = request.query.gender;
            var query = {};
            if(year =undefined){
                query.year = parseInt(year);
            }
            if(province= undefined){
                query.province = province;
            }
            if(gender= undefined){
                query.gender = gender;
            }
            if(Object.keys(query).length >0){
                db.find(query,(err,docs) =>{
                    if(err){
                        console.log(`Error getting /density-population ${err}`)
                        response.sendStatus(500);
                    }else{
                        console.log(`Data returned`);
                        response.json(docs.map((c)=>{
                            delete c._id;
                            return c;
                        }));  
                    }
                });
            }else{
                db.find({},(err,docs) =>{
                    if(err){
                        console.log(`Error getting /density-population ${err}`)
                        response.sendStatus(500);
                    }else{
                        console.log(`Data returned`);
                        response.json(docs.map((c)=>{
                            delete c._id;
                            return c;
                        }));  
                    }
                });
            }
            
        
        });
            //GET a recurso específico
        app.get(BASE_API_URL+'/density-population/:year/:province/:gender', (request,response)=>{
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            db.find({"year":parseInt(year),"province":province,"gender":gender},(err,docs)=>{
                if(err){
                    console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`)
                    response.sendStatus(500);
                }else if(docs.length == 0){
                    console.log(`density-population/${year}/${province}/${gender} not found`);
                    response.sendStatus(404);
                }else{
                    console.log(`Data of density-population/${year}/${province}/${gender} returned`);
                    response.json(docs.map((c) => {
                        delete c._id;
                        return(c);
                    }))
                }
            });
        });
            //GET para cargar datos
        app.get(BASE_API_URL+'/density-population/loadInitialData', (request, response) => {
            console.log(`New Request to /loadInitialData.`);
            db.find({}, async (err, docs) => {
                if(err){
                    console.log(`Error loading initial Data: ${err}.`);
                    response.sendStatus(500);
                }else if(docs.length=0){
                    console.log(`Data is already stored.`);
                    response.sendStatus(200);
                }else{
                    let datos = ppo_samples.array_data
                    db.insert(datos);
                    console.log(`Inserted data in the database.`);
                    response.sendStatus(201);
                }
            });
        });
        //Todos los DELETE
            //DELETE total
        app.delete(BASE_API_URL+"/density-population", (request,response) => {
            console.log(`New DELETE total`);
            db.remove({},{multi:true},(err, numRemoved)=>{
                if(err){
                    console.log(`Error deleting density-population`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${numRemoved}`);
                    response.sendStatus(200);
                }
            });
        });
            //DELETE específico
        app.delete(BASE_API_URL+"/density-population/:year/:province/:gender", (request,response) => {
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            console.log(`New DELETE`);
            db.remove({"year":parseInt(year),"province":province,"gender":gender},{},(err, numRemoved)=>{
                if(err){
                    console.log(`Error deleting density-population/${year}/${province}/${gender}: ${err}`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${numRemoved}`);
                    response.sendStatus(200);
                }
            });
        });

        //POST
        app.post(BASE_API_URL+"/density-population", (request,response) => {
            var newData = request.body;
            console.log("New POST to /density-population");           
            if(!newData.hasOwnProperty('year') || 
            !newData.hasOwnProperty('province') || 
            !newData.hasOwnProperty('gender') ||
            !newData.hasOwnProperty('municipality_size_lf_ft') || 
            !newData.hasOwnProperty('municipality_size_bt_ft_tht') ||
            !newData.hasOwnProperty('municipality_size_gt_tht') ||
            !newData.hasOwnProperty('capital_size')){
                console.log("Falta algún dato en el JSON")
                response.sendStatus(400)
            }else{
                db.find({'year': parseInt(newData.year), 'province' : newData.province, 'gender':newData.gender}, (err, docs) =>{
                    if(err){
                        console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`);
                        response.sendStatus(500);
                    }else if(docs.length == 0){
                        //Modificamos el tipo de los valores al correcto
                        newData.year = parseInt(newData.year);
                        newData.municipality_size_lf_ft = parseInt(newData.municipality_size_lf_ft);
                        newData.municipality_size_bt_ft_tht = parseInt(newData.municipality_size_bt_ft_tht);
                        newData.municipality_size_gt_tht = parseInt(newData.municipality_size_gt_tht);
                        newData.capital_size = parseInt(newData.capital_size);

                        //Guardamos el nuevo dato
                        db.insert(newData);
    
                        //Avisamos a consola y a usuario
                        console.log(BASE_API_URL+`/density-population/${newData.year}/${newData.province}`);
                        response.sendStatus(201);
    
                    //Data.length no vacío, ya existe el recurso
                    }else{
                        //El recurso a crear ya existe, avisamos
                        console.log(`Data ss-affiliates/${newData.year}/${newData.province} already exist`);
                        response.sendStatus(409);
                    }
                });
            }
        });
            //POST NO PERMITIDO /density-population/province/year/gender
        app.post(BASE_API_URL+"/density-population/:year/:province/:gender", (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });

        //PUT sin terminar
        app.put(BASE_API_URL+'/density-population/:year/:province/:gender', (request,response)=>{
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            db.find({"year":parseInt(year),"province":province,"gender":gender},{},(err,docs)=>{
                if(err){
                    console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`)
                    response.sendStatus(500);
                }else if(docs.length == 0){
                    console.log(`density-population/${year}/${province}/${gender} not found`);
                    response.sendStatus(404);
                }else{
                    console.log(`Data of density-population/${year}/${province}/${gender} returned`);
                    response.json(docs.map((c) => {
                        delete c._id;
                        return(c);
                    }))
                }
            });
        });

        app.put(BASE_API_URL+'/density-population/:year', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
    
        //Put no permitido a /ss-affiliates/province
        app.put(BASE_API_URL+'/density-population/:year/:province', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });



    }
}