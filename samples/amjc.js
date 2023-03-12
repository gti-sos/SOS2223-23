const BASE_API_URL_AMJC = "/api/v1/hired-people";
var Datastore = require(`nedb`);
var db = new Datastore();

var array = [{year:2012, province:"Almería", gender:"Hombres", indefinite_contract:2741, single_construction_contract:15494,
    multiple_construction_contract:6002, single_eventual_contract:4743, multiple_eventual_contract:1856},
{year:2012, province:"Almería", gender:"Mujeres", indefinite_contract:2211, single_construction_contract:12581,
    multiple_construction_contract:5174, single_eventual_contract:5397, multiple_eventual_contract:2123},
{year:2012, province:"Cádiz", gender:"Hombres", indefinite_contract:4606, single_construction_contract:21563,
    multiple_construction_contract:12906, single_eventual_contract:13624, multiple_eventual_contract:9764},
{year:2012, province:"Cádiz", gender:"Mujeres", indefinite_contract:3995, single_construction_contract:11653,
    multiple_construction_contract:4187, single_eventual_contract:15247, multiple_eventual_contract:11675},
{year:2012, province:"Córdoba", gender:"Hombres", indefinite_contract:2927, single_construction_contract:15314,
    multiple_construction_contract:12061, single_eventual_contract:7376, multiple_eventual_contract:6809},
{year:2012, province:"Córdoba", gender:"Mujeres", indefinite_contract:2589, single_construction_contract:13588,
    multiple_construction_contract:8200, single_eventual_contract:9406, multiple_eventual_contract:8391},
{year:2012, province:"Granada", gender:"Hombres", indefinite_contract:3483, single_construction_contract:13617,
    multiple_construction_contract:6607, single_eventual_contract:11453, multiple_eventual_contract:9583},
{year:2012, province:"Granada", gender:"Mujeres", indefinite_contract:3486, single_construction_contract:10239,
    multiple_construction_contract:4699, single_eventual_contract:14200, multiple_eventual_contract:13309},
{year:2012, province:"Huelva", gender:"Hombres", indefinite_contract:1972, single_construction_contract:15383,
    multiple_construction_contract:13040, single_eventual_contract:3798, multiple_eventual_contract:2175},
{year:2012, province:"Huelva", gender:"Mujeres", indefinite_contract:1380, single_construction_contract:14092,
    multiple_construction_contract:8788, single_eventual_contract:4200, multiple_eventual_contract:2574},
{year:2013, province:"Jaén", gender:"Hombres", indefinite_contract:2245, single_construction_contract:12872,
    multiple_construction_contract:12801, single_eventual_contract:8332, multiple_eventual_contract:7650}];

function result(province, year){
    var filtrar_provincia = array.filter(n => n.province == "Cádiz" && n.year == 2012);
    var j = 0;
    for(var i=0;i<filtrar_provincia.length;i++){
        j+=filtrar_provincia[i].indefinite_contract;
    }
    var media_contratos_indefinidos = j / filtrar_provincia.length;
    var mensaje = `La media de contratos indefinidos entre hombres y mujeres en Cádiz durante el año 2012 fue de ${media_contratos_indefinidos} contratos.`
    return mensaje
}

module.exports = {
    api: (app) => {
        //_____________GET_______________
            //GET a samples
            app.get('/samples/amjc', (request,response) => {
                var mensaje = result()
                response.json(mensaje)
                console.log('New Request to /samples/amjc.');
            });
            // GET LoadInitialData
            app.get(BASE_API_URL_AMJC + '/loadInitialData', (request, response) => {
                console.log(`New Request /hired-people/loadInitialData.`);
                db.find({}, async (error, data) => {
                    if(error){
                        console.log(`Error loading Initial Data: ${error}.`);
                        response.sendStatus(500);
                    }else if(data.length != 0){
                        console.log(`There are data ${data.length} loaded.`);
                        response.sendStatus(200);
                    }else{
                        let datos = array;
                        db.insert(datos);
                        console.log(`Inserted ${datos.length} data in the database.`);
                        response.sendStatus(201);
                    }
                });
            });
            //GET con y sin Query
            app.get(BASE_API_URL_AMJC, (request,response) => {
                var year = request.query.year;
                var province = request.query.province;
                var gender = request.query.gender;
                var query = {};
                console.log(`New request to /hired-people.`);
                if(year !=undefined){
                    query.year = parseInt(year);
                }else if(province!= undefined){
                    query.province = province;
                }else if(gender!= undefined){
                query.gender = gender;
                }else if(Object.keys(query).length > 0){
                    db.find(query,(error,data) =>{
                        if(error){
                            console.log(`Error getting /hired-people: ${error}.`);
                            response.sendStatus(500);
                        }else{
                            console.log(`Data returned.`);
                            response.json(data.map((d)=>{
                                delete d._id;
                                return d;
                            }));  
                        }
                    });
                }else{
                    db.find({},(error,data) => {
                        if(error){
                            console.log(`Error getting /hired-people: ${error}.`);
                            response.sendStatus(500);
                        }else{
                            console.log(`Data returned.`);
                            response.json(data.map((d)=>{
                                delete d._id;
                                return d;
                            }));  
                        }
                    });
                }
            });

            //GET a recurso específico
            app.get(BASE_API_URL_AMJC + '/:year/:province/:gender', (request,response) => {
                var year = request.params.year;
                var province = request.params.province;
                var gender = request.params.gender;
                db.find({"year":parseInt(year),"province":province,"gender":gender}, (error,data) => {
                    if(error){
                        console.log(`Error getting /hired-people/${year}/${province}/${gender}: ${error}`)
                        response.sendStatus(500);
                    }else if(data.length == 0){
                        console.log(`/hired-people/${year}/${province}/${gender} not found.`);
                        response.sendStatus(404);
                    }else{
                        console.log(`Data of /hired-people/${year}/${province}/${gender} returned`);
                        response.json(data.map((d) => {
                            delete d._id;
                            return(d);
                        }))
                    }
                });
            });

        //_____________POST_______________
            //POST Permitido
            app.post(BASE_API_URL_AMJC, (request,response) => {
                var newReq = request.body;
                console.log("New POST to /hired-people.");           
                if(!newReq.hasOwnProperty('year') || !newReq.hasOwnProperty('province') || 
                    !newReq.hasOwnProperty('gender') || !newReq.hasOwnProperty('indefinite_contract') || 
                    !newReq.hasOwnProperty('single_construction_contract') || !newReq.hasOwnProperty('multiple_construction_contract') ||
                    !newReq.hasOwnProperty('single_eventual_contract') || !newReq.hasOwnProperty('multiple_eventual_contract')){
                    //Falta algun dato
                    console.log("Falta algún dato en el JSON.");
                    response.sendStatus(400);
                }else{
                    db.find({'year': parseInt(newReq.year), 'province' : newReq.province, 'gender':newReq.gender}, (error, data) => {
                        if(error){
                            console.log(`Error getting /hired-people/${year}/${province}/${gender}: ${error}.`);
                            response.sendStatus(500);
                        }else if(data.length == 0){
                            //Modificar valores a Integer
                            newReq.year = parseInt(newReq.year);
                            newReq.indefinite_contract = parseInt(newReq.indefinite_contract);
                            newReq.single_construction_contract = parseInt(newReq.single_construction_contract);
                            newReq.multiple_construction_contract = parseInt(newReq.multiple_construction_contract);
                            newReq.single_eventual_contract = parseInt(newReq.single_eventual_contract);
                            newReq.multiple_eventual_contract = parseInt(newReq.multiple_eventual_contract);
    
                            db.insert(newReq);
        
                            console.log(BASE_API_URL_AMJC + `/${newReq.year}/${newReq.province}/${newReq.gender}`);
                            response.sendStatus(201);
                        }else{
                            console.log(`/hired-people/${newReq.year}/${newReq.province} already exist.`);
                            response.sendStatus(409);
                        }
                    });
                }
            });
            //POST No Permitido
            app.post(BASE_API_URL_AMJC + "/:year/:province/:gender", (request, response) => {
                console.log('Unauthorized method.');
                response.sendStatus(405);
            });

        //_____________DELETE_______________
            //DELETE Genérico
            app.delete(BASE_API_URL_AMJC, (request,response) => {
                console.log("New DELETE to all data.");
                db.remove({},{multi:true},(error, data)=>{
                    if(error){
                        console.log("Error deleting /hired-people.");
                        response.sendStatus(500);
                    }else{
                        console.log(`All data removed: ${data}.`);
                        response.sendStatus(200);
                    }
                });
            });
            //DELETE Específico
            app.delete(BASE_API_URL_AMJC+"/:year/:province/:gender", (request,response) => {
                var year = request.params.year;
                var province = request.params.province;
                var gender = request.params.gender;
                console.log(`New specific DELETE.`);
                db.remove({"year":parseInt(year),"province":province,"gender":gender}, {}, (error, data) => {
                    if(error){
                        console.log(`Error deleting /hired-people/${year}/${province}/${gender}: ${error}.`);
                        response.sendStatus(500);
                    }else{
                        console.log(`Data removed: ${data}.`);
                        response.sendStatus(200);
                    }
                });
            });
        //_____________PUT_______________
            //PUT No Permitido /hired-people
            app.put(BASE_API_URL_AMJC, (request,response) => {
                console.log('Metodo no permitido');
                response.sendStatus(405);
            });
            //PUT No Permitido a /hired-people/year
            app.put(BASE_API_URL_AMJC + `/:year`, (request,response) => {
                console.log('Metodo no permitido');
                response.sendStatus(405);
            });
            //PUT No Permitido a /hired-people/year/province
            app.put(BASE_API_URL_AMJC + `/:year/:province`, (request,response) => {
                console.log('Metodo no permitido');
                response.sendStatus(405);
            });

            //PUT Correcto
            app.put(BASE_API_URL_AMJC + '/:year/:province/:gender', (request,response)=>{
                var year = request.params.year;
                var province = request.params.province;
                var gender = request.params.gender;
                let newReq = request.body;

                if(!newReq.hasOwnProperty('year') || !newReq.hasOwnProperty('province') || 
                    !newReq.hasOwnProperty('gender') || !newReq.hasOwnProperty('indefinite_contract') || 
                    !newReq.hasOwnProperty('single_construction_contract') || !newReq.hasOwnProperty('multiple_construction_contract') ||
                    !newReq.hasOwnProperty('single_eventual_contract') || !newReq.hasOwnProperty('multiple_eventual_contract')){
                    //Falta algún campo
                    console.log('Some field is missing.');
                    response.sendStatus(400);
                }else{
                    if(newReq.year != year || newReq.province != province || newReq.gender != gender){
                        console.log('Data doesnt match.');
                        response.sendStatus(400);
        
                    }else{
                        //Vamos a modificar solo si existe, para ellos buscamos el recurso
                        db.find({'year': parseInt(year), 'province' : province, 'gender':gender}, (error, data) => {
                            if(error){
                                //Error al buscar si existe dicho recurso
                                console.log(`Error getting /hired-people/${year}/${province}/${gender}: ${error}.`);
                                response.sendStatus(500); 
                            //No hay errores, modificar si existe el dato:
                            }else if(data.length !== 0){
                                //Modificamos el tipo de los valores al correcto
                                newReq.year = parseInt(newReq.year);
                                newReq.indefinite_contract = parseInt(newReq.indefinite_contract);
                                newReq.single_construction_contract = parseInt(newReq.single_construction_contract);
                                newReq.multiple_construction_contract = parseInt(newReq.multiple_construction_contract);
                                newReq.single_eventual_contract = parseInt(newReq.single_eventual_contract);
                                newReq.multiple_eventual_contract = parseInt(newReq.multiple_eventual_contract);
        
                                //Guardamos el nuevo dato
                                db.update({'year': parseInt(year), 'province' : province, 'gender':gender}, {newReq}, {}, (error, num) => {
                                    if(error){
                                        console.log(`Error updating ${BASE_API_URL} "/hired-people/${year}/${province}/${gender}.`);
                                        response.sendStatus(500);
                                    }else{
                                        console.log(`Correctly Updated ${BASE_API_URL} "/hired-people/${year}/${province}/${gender}.`);
                                        response.sendStatus(200);
                                    }
                                }); 
                            }else{ //Data.length vacío, no existe el recurso
                                console.log(`Data /hired-people/${year}/${province}/${gender} not exist.`);
                                response.sendStatus(404);
                            }
                        
                        });
                    }
                }
            });
    }
}
