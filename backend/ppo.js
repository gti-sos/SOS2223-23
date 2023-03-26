//const ppo_samples = require('./pposamples');
const BASE_API_URL = "/api/v1";
var csvdata = require('csvdata');
var Datastore = require(`nedb`);
var db = new Datastore();

module.exports = {     
    api: (app) => {
        //Todos los GET
        app.get(BASE_API_URL+'/density-population/docs', (request, response) => {
            console.log('Redirecting to documentation site of density-population');
            response.status(301).redirect("https://documenter.getpostman.com/view/26052111/2s93RNzFGX");
        });
            //GET total y querys
        app.get(BASE_API_URL+'/density-population', (request,response)=>{
            var year_query = request.query.year;
            var province_query = request.query.province;
            var gender_query = request.query.gender;
            var municipality_size_lt_ft_under = request.query.municipality_size_lt_ft_under;
            var municipality_size_bt_ft_tht_under = request.query.municipality_size_bt_ft_tht_under;
            var municipality_size_gt_tht_under = request.query.municipality_size_gt_tht_under;
            var capital_size_under = request.query.capital_size_under;        
            console.log(`New request to /density-population.`);
                db.find({}, {_id: 0}, (error, docs) => {
                    if(error){
                        console.log(`Error getting density-population.`);
                        response.sendStatus(500);
                    }else if(docs.length == 0){
                        console.log(`Density-population not found`);
                        response.sendStatus(404);
                    }else{
                        let i = -1;
                        if(!request.query.offset){ 
                            var offset = -1;
                        }else{
                            var offset = parseInt(request.query.offset);
                        }
                        // Filtramos según las query
                        console.log(municipality_size_lt_ft_under)
                        let datos = docs.filter((x) => {
                            return (((year_query == undefined)||(parseInt(year_query) === x.year))&&
                            ((request.query.from == undefined)||(parseInt(request.query.from) <= x.year))&&
                            ((request.query.to == undefined)||(parseInt(request.query.to) >= x.year))&&
                            ((province_query == undefined)||(province_query === x.province))&&
                            ((gender_query == undefined)||(gender_query === x.gender))&&
                            ((municipality_size_lt_ft_under == undefined)||(parseFloat(municipality_size_lt_ft_under) >= x.municipality_size_lt_ft))&&
                            ((municipality_size_bt_ft_tht_under == undefined)||(parseFloat(municipality_size_bt_ft_tht_under) >= x.municipality_size_bt_ft_tht))&&
                            ((municipality_size_gt_tht_under == undefined)||(parseFloat(municipality_size_gt_tht_under) >= x.municipality_size_gt_tht))&&
                            ((capital_size_under == undefined)||(parseFloat(capital_size_under) >= x.capital_size)))
                        }).filter((x) => {
                            // Paginación
                            i=i+1;
                            if(request.query.limit==undefined){ 
                                var cond = true;
                            }else{ 
                                var cond = (offset + parseInt(request.query.limit)) >= i;
                            }
                            return (i>offset)&&cond;
                        });
                        if(docs.length == 0){
                            console.log(`Density-population not found`);
                            response.sendStatus(404);
                        }else{
                            console.log(`Data of Density-population returned: ${docs.length}`);
                            response.json(datos);
                        }
                    }
                })
            });
            //GET a recurso específico
        app.get(BASE_API_URL+'/density-population/:year/:province/:gender', (request,response)=>{
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            db.find({"year":parseInt(year),"province":province,"gender":gender},{_id: 0},(err,docs)=>{
                if(err){
                    console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`)
                    response.sendStatus(500);
                }else if(docs.length == 0){
                    console.log(`density-population/${year}/${province}/${gender} not found`);
                    response.sendStatus(404);
                }else{
                    console.log(`Data of density-population/${year}/${province}/${gender} returned`);
                    response.json(docs[0]);
                }
            });
        });
            //GET para cargar datos
        app.get(BASE_API_URL+'/density-population/loadInitialData', (request, response) => {
            console.log(`New request to /loadInitialData.`);
            db.find({}, async (err, docs) => {
                if(err){
                    console.log(`Error loading initial Data: ${err}.`);
                    response.sendStatus(500);
                }else if(docs.length=0){
                    console.log(`Data is already stored.`);
                    response.sendStatus(200);
                }else{
                    let datos = await csvdata.load('./data/data_p.csv');
                    db.insert(datos);
                    console.log(`Inserted ${datos.length} data in the database.`);
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

                        db.insert(newData);
    
                        console.log(BASE_API_URL+`/density-population/${newData.year}/${newData.province}`);
                        response.sendStatus(201);
    
                    
                    }else{ //Data.length no vacío, ya existe el recurso
                        //El recurso a crear ya existe, avisamos
                        console.log(`Data density-population/${newData.year}/${newData.province} already exist`);
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
        //PUT
            //PUT bueno
        app.put(BASE_API_URL+"/density-population/:year/:province/:gender", (request, response) => {
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            let newData = request.body;
    
            if(!newData.hasOwnProperty('year') || 
            !newData.hasOwnProperty('province') ||
            !newData.hasOwnProperty('gender') || 
            !newData.hasOwnProperty('municipality_size_lf_ft') ||
            !newData.hasOwnProperty('municipality_size_bt_ft_tht') || 
            !newData.hasOwnProperty('municipality_size_gt_tht') ||
            !newData.hasOwnProperty('capital_size')){
                console.log('Falta algun dato');
                response.sendStatus(400);
            
            //Si todos los campos están presentes
            }else{
                //Comprobamos que la query y el body coinciden
                if(newData.year != year || newData.province != province || newData.gender != gender){
                    console.log('Los datos no coinciden');
                    response.sendStatus(400);
    
                }else{
                    //Vamos a modificar solo si existe, para ellos buscamos el recurso
                    db.find({'year': parseInt(year), 'province' : province, 'gender':gender}, (err, docs) => {
                        if(err){
                            //Error al buscar si existe dicho recurso
                            console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`);
                            response.sendStatus(500); 
                        //No hay errores, modificar si existe el dato:
                        }else if(docs.length !== 0){
                            //Modificamos el tipo de los valores al correcto
                            newData.year = parseInt(newData.year);
                            newData.municipality_size_lf_ft = parseInt(newData.municipality_size_lf_ft);
                            newData.municipality_size_bt_ft_tht = parseInt(newData.municipality_size_bt_ft_tht);
                            newData.municipality_size_gt_tht = parseInt(newData.municipality_size_gt_tht);
                            newData.capital_size = parseInt(newData.capital_size);
    
                            //Guardamos el nuevo dato
                            db.update({'year': parseInt(year), 'province' : province, 'gender':gender}, {newData}, {}, (err, num) => {
                                if(err){
                                    console.log(`Error updating ${BASE_API_URL} "/density-population/${year}/${province}/${gender}`);
                                    response.sendStatus(500);
                                }else{
                                    console.log(`Correctly Updated ${BASE_API_URL} "/density-population/${year}/${province}/${gender}`);
                                    response.sendStatus(200);
                                }
                            }); 
                        }else{ //Data.length vacío, no existe el recurso
                            console.log(`Data density-population/${year}/${province}/${gender} not exist`);
                            response.sendStatus(404);
                        }
                    
                    });
                }
            }
        });

            //PUT no permitido
        app.put(BASE_API_URL+'/density-population', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
            //PUT no permitido
        app.put(BASE_API_URL+'/density-population/:year', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
    
            //PUT no permitido
        app.put(BASE_API_URL+'/density-population/:year/:province', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
    }
}