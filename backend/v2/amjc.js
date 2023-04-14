const BASE_API_URL_AMJC = "/api/v2/hired-people";
import { data_amjc } from '../data/data_amjc.js';
import { config } from '../data/config.js';
import Papa from 'papaparse';
import Datastore from 'nedb';
var db = new Datastore();

function amjc2(app){
    //_____________GET_______________
        //GET a docs
        app.get(`${BASE_API_URL_AMJC}/docs`, (request, response) => {
            console.log('Redirecting to documentation site');
            response.status(301).redirect("https://documenter.getpostman.com/view/26053157/2s93Xtzk4e");
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
                    let datos = await Papa.parse(data_amjc, config);
                    db.insert(datos.data);
                    console.log(`Inserted ${datos.data.length} data in the database.`);
                    response.sendStatus(201);
                }
            });
        });
        //GET con y sin Query
        app.get(BASE_API_URL_AMJC, (request,response) => {
            var year_query = request.query.year;
            var province_query = request.query.province;
            var gender_query = request.query.gender;
            var indefinite_contract_under = request.query.indefinite_contract_under;
            var single_construction_contract_under = request.query.single_construction_contract_under;
            var multiple_construction_contract_under = request.query.multiple_construction_contract_under;
            var single_eventual_contract_under = request.query.single_eventual_contract_under;
            var multiple_eventual_contract_under = request.query.multiple_eventual_contract_under;
            console.log(`New request to /hired-people.`);
            db.find({}, {_id: 0}, (error, data) => {
                if(error){
                    console.log(`Error getting hired-people.`);
                    response.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`hired-people not found`);
                    response.sendStatus(404);
                }else{
                    // Inicializamos un contador (limit) y el offset
                    let i = -1;
                    if(!request.query.offset){ 
                        var offset = -1;
                    }else{
                        var offset = parseInt(request.query.offset);
                    }
                    // Filtramos los datos
                    let datos = data.filter((x) => {
                        return (((year_query == undefined)||(parseInt(year_query) === x.year))&&
                        ((request.query.from == undefined)||(parseInt(request.query.from) <= x.year))&&
                        ((request.query.to == undefined)||(parseInt(request.query.to) >= x.year))&&
                        ((province_query == undefined)||(province_query === x.province))&&
                        ((gender_query == undefined)||(gender_query === x.gender))&&
                        ((indefinite_contract_under == undefined)||(parseInt(indefinite_contract_under) >= x.indefinite_contract))&&
                        ((single_construction_contract_under == undefined)||(parseInt(single_construction_contract_under) >= x.single_construction_contract))&&
                        ((multiple_construction_contract_under == undefined)||(parseInt(multiple_construction_contract_under) >= x.multiple_construction_contract))&&
                        ((single_eventual_contract_under == undefined)||(parseInt(single_eventual_contract_under) >= x.single_eventual_contract))&&
                        ((multiple_eventual_contract_under == undefined)||(parseInt(multiple_eventual_contract_under) >= x.multiple_eventual_contract)))
                    }).filter((x) => {
                        // Paginación
                        i = i+1;
                        if(request.query.limit==undefined){ 
                            var cond = true;
                        }else{ 
                            var cond = (offset + parseInt(request.query.limit)) >= i;
                        }
                        return (i>offset)&&cond;
                    });
                    // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
                    if(datos.length == 0){
                        console.log(`hired-people not found`);
                        response.sendStatus(404);
                    // Si por el contrario encontramos datos
                    }else{
                        console.log(`Data of hired-people returned: ${datos.length}`);
                        response.json(datos);
                    }
                }
            })
        });

        //GET a recurso específico
        app.get(BASE_API_URL_AMJC + '/:year/:province/:gender', (request,response) => {
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            db.find({"year":parseInt(year),"province":province,"gender":gender}, {_id: 0}, (error,data) => {
                if(error){
                    console.log(`Error getting /hired-people/${year}/${province}/${gender}: ${error}`)
                    response.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`/hired-people/${year}/${province}/${gender} not found.`);
                    response.sendStatus(404);
                }else{
                    console.log(`Data of /hired-people/${year}/${province}/${gender} returned`);
                    response.json(data[0]);
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
                            db.update({'year': parseInt(year), 'province' : province, 'gender':gender}, {'province' : province, 
                                                                                                        'year': parseInt(year),
                                                                                                        'gender':gender, 
                                                                                                        'indefinite_contract':parseInt(newReq.indefinite_contract), 
                                                                                                        'single_construction_contract': parseInt(newReq.single_construction_contract), 
                                                                                                        'multiple_construction_contract':parseInt(newReq.multiple_construction_contract),
                                                                                                        'single_eventual_contract':parseInt(newReq.single_eventual_contract),
                                                                                                        'multiple_eventual_contract':parseInt(newReq.multiple_eventual_contract)},
                             {}, (error, num) => {
                                if(error){
                                    console.log(`Error updating ${BASE_API_URL_AMJC} "/hired-people/${year}/${province}/${gender}.`);
                                    response.sendStatus(500);
                                }else{
                                    console.log(`Correctly Updated ${BASE_API_URL_AMJC} "/hired-people/${year}/${province}/${gender}.`);
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
export { amjc2 };
