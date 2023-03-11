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
            console.log(`year ${year} province ${province} gender ${gender}`)
            if(year !=undefined){
                query.year = parseInt(year);
            }
            if(province!= undefined){
                query.province = province;
            }
            if(gender!= undefined){
                query.gender = gender;
            }
            console.log(query)
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
                }else if(docs.length!=0){
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
            console.log(`newdata = ${JSON.stringify(newData,null,2)}`);
            
            console.log("New POST to /density-population");
    
            db.insert(newData, (err,newDat) =>{
                if(err){
                    console.log(`Error inserting density-population/${year}/${province}/${gender}: ${err}`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data inserted ${newDat}`);
                    response.sendStatus(201);
                }
            }); 
        });
        //PUT
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



    }
}