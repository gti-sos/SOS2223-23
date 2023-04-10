const BASE_API_URL_ss_affiliates = `/api/v1/ss-affiliates`;
import Datastore from 'nedb';
import { data_rvr } from '../data/data_rvr.js';
import { config } from '../data/config.js';
import Papa from 'papaparse';
var db = new Datastore();

    


//_____________________________________Export____________________________________________


function rvrv1(app){

//___________________________________GETS__________________________________

    // Ruta de la documentacion de la API
    app.get(`${BASE_API_URL_ss_affiliates}/docs`, (req, res) => {
        console.log('Redirecting to documentation site');
        res.status(301).redirect("https://documenter.getpostman.com/view/25997396/2s93JzKfdw");
    });

    // GET LoadInitialData
    app.get(`${BASE_API_URL_ss_affiliates}/loadInitialData`, (req, res) => {

        console.log(`New Request to /loadInitialData.`);

        // Buscamos si hay registros en la base de datos
        db.find({}, async (err, data) => {
            
            // Comprobamos los errores que han podido surgir
            if(err){

                console.log(`Error loading Initial Data: ${err}.`);

                // El estado es 500: Internal Server Error
                res.sendStatus(500);

            // Si existen datos no se introducen datos en la base de datos
            }else if(data.length != 0){

                console.log(`There are data ${data.length} loaded.`);
                
                // Si existen datos el estado es 200: OK
                res.sendStatus(200);

            }else{

                // Cargamos los datos del csv
                let datos = await Papa.parse(data_rvr, config);

                
                // Los insertamos en la base de datos
                db.insert(datos.data);

                console.log(`Inserted ${datos.data.length} data in the database.`);

                // Si se crean datos el estado es 201: Created
                res.sendStatus(201);
            }
        });
    });

    //GET /ss-affiliates/province/year (First Province, then Year): Recurso único
    app.get(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {

        // Inicializamos los valores que necesitaremos
        let year = req.params.year;
        let province = req.params.province;

        console.log(`New request to /ss-affiliates/${province}/${year}`);

        // Recuperamos el registro concreto que se nos pide
        db.find({'year': parseInt(year), 'province' : province}, {_id : 0}, (err, data) => {

            // Si existen errores:
            if(err){

                console.log(`Error getting ss-affiliates/${province}/${year}: ${err}`);
                // Estado 500: Internal Server Error
                res.sendStatus(500);
            
            // Si no existen datos 
            }else if(data.length == 0){

                console.log(`ss-affiliates/${province}/${year} not found`);
                // Estado 404: Not Found
                res.sendStatus(404);

            // Si existen datos
            }else{

                console.log(`Data ss-affiliates/${province}/${year} returned`);
                // Estado 200: Ok
                res.json(data[0]);
            }
        });
    });


    //GET /ss-affiliates/province: Recursos por provincia
    app.get(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {

        // Inicializamos las variables
        let province = req.params.province;

        console.log(`New request to /ss-affiliates/${province}`);

        // Buscamos los registros que tengan el dado campo provincia
        db.find({'province': province}, {_id: 0}, (err, data) => {
            console.log(province);
            console.log(data);
            // Si existen errores
            if(err){

                console.log(`Error getting ss-affiliates`);
                // Estado 500: Internal Server Error
                res.sendStatus(500);

            // Si no existen datos
            }else if(data.length == 0){

                console.log(`ss-affiliates/${province} not found`);
                // Estado 404: Not Found
                res.sendStatus(404);

            }else{
                let i = -1;
                if(!req.query.offset){ var offset = -1;}else{ var offset = parseInt(req.query.offset);}

                // Filtramos los datos, para cada campo posible se devuelve true si no se pasa en la query, 
                // y si es un parametro se comprueba la condicion
                let datos = data.filter((x) => {
                    return (((req.query.year == undefined)||(parseInt(req.query.year) === x.year))&&
                    ((req.query.from == undefined)||(parseInt(req.query.from) <= x.year))&&
                    ((req.query.to == undefined)||(parseInt(req.query.to) >= x.year))&&
                    ((req.query.ss_affiliation_under == undefined)||(parseInt(req.query.ss_affiliation_under) >= x.ss_affiliation))&&
                    ((req.query.ss_affiliation_over == undefined)||(parseInt(req.query.ss_affiliation_over) <= x.ss_affiliation))&&
                    ((req.query.n_cont_temporary_under == undefined)||(parseInt(req.query.n_cont_temporary_under) >= x.n_cont_temporary))&&
                    ((req.query.n_cont_temporary_over == undefined)||(parseInt(req.query.n_cont_temporary_over) <= x.n_cont_temporary))&&
                    ((req.query.n_cont_indef_under == undefined)||(parseInt(req.query.n_cont_indef_under) >= x.n_cont_indef))&&
                    ((req.query.n_cont_indef_over == undefined)||(parseInt(req.query.n_cont_indef_over) <= x.n_cont_indef))&&
                    ((req.query.n_cont_eventual_under == undefined)||(parseInt(req.query.n_cont_eventual_under) >= x.n_cont_eventual))&&
                    ((req.query.n_cont_eventual_over == undefined)||(parseInt(req.query.n_cont_eventual_over) <= x.n_cont_eventual)));
                }).filter((x) => {
                    // Por ultimo implementamos la paginacion
                    i = i+1;
                    if(req.query.limit==undefined){ var cond = true;}else{ var cond = (offset + parseInt(req.query.limit)) >= i;}
                    return (i>offset)&&cond;
                });

                // Comprobamos si después del filtrado hay datos, si no:
                if(datos.length == 0){

                    console.log(`ss-affiliates not found`);
                    // Estado 404: Not Found
                    res.sendStatus(404);
                
                // Si hay datos:
                }else{

                    console.log(`Data of ss-affiliates returned: ${datos.length}`);
                    // Devolvemos datos, estado 200: Ok
                    res.json(datos);
                    
                }
            }
        });
        
    });


    //GET /ss-affiliates: Lista de Recursos
    app.get(`${BASE_API_URL_ss_affiliates}`, (req, res) => {

        console.log(`New request to /ss-affiliates`);

        // Recuperamos todos los registros de la base de datos para filtrarlos despues
        db.find({}, {_id: 0}, (err, data) => {

                    // Comprobamos los errores que han podido surgir
                    if(err){

                        console.log(`Error getting ss-affiliates`);

                        // El estado es 500: Internal Server Error
                        res.sendStatus(500);

                    // Comprobamos si existen datos:
                    }else if(data.length == 0){

                        console.log(`ss-affiliates not found`);

                        // Si no existen datos el estado es 404: Not Found
                        res.sendStatus(404);

                    }else{

                        // Inicializamos los valores necesarios para el filtrado: un contador para el limit y el valor por defecto offset
                        let i = -1;
                        if(!req.query.offset){ var offset = -1;}else{ var offset = parseInt(req.query.offset);}

                        // Filtramos los datos, para cada campo posible se devuelve true si no se pasa en la query, 
                        // y si es un parametro se comprueba la condicion
                        let datos = data.filter((x) => {
                            return (((req.query.year == undefined)||(parseInt(req.query.year) === x.year))&&
                            ((req.query.from == undefined)||(parseInt(req.query.from) <= x.year))&&
                            ((req.query.to == undefined)||(parseInt(req.query.to) >= x.year))&&
                            ((req.query.province == undefined)||(req.query.province === x.province))&&
                            ((req.query.ss_affiliation_under == undefined)||(parseInt(req.query.ss_affiliation_under) >= x.ss_affiliation))&&
                            ((req.query.ss_affiliation_over == undefined)||(parseInt(req.query.ss_affiliation_over) <= x.ss_affiliation))&&
                            ((req.query.n_cont_temporary_under == undefined)||(parseInt(req.query.n_cont_temporary_under) >= x.n_cont_temporary))&&
                            ((req.query.n_cont_temporary_over == undefined)||(parseInt(req.query.n_cont_temporary_over) <= x.n_cont_temporary))&&
                            ((req.query.n_cont_indef_under == undefined)||(parseInt(req.query.n_cont_indef_under) >= x.n_cont_indef))&&
                            ((req.query.n_cont_indef_over == undefined)||(parseInt(req.query.n_cont_indef_over) <= x.n_cont_indef))&&
                            ((req.query.n_cont_eventual_under == undefined)||(parseInt(req.query.n_cont_eventual_under) >= x.n_cont_eventual))&&
                            ((req.query.n_cont_eventual_over == undefined)||(parseInt(req.query.n_cont_eventual_over) <= x.n_cont_eventual)));
                        }).filter((x) => {
                            // Por ultimo implementamos la paginacion
                            i = i+1;
                            if(req.query.limit==undefined){ var cond = true;}else{ var cond = (offset + parseInt(req.query.limit)) >= i;}
                            return (i>offset)&&cond;
                        });

                        // Comprobamos si tras el filtrado sigue habiendo datos, si no hay:
                        if(datos.length == 0){

                            console.log(`ss-affiliates not found`);
                            // Estado 404: Not Found
                            res.sendStatus(404);
                            
                        // Si por el contrario encontramos datos
                        }else{

                            console.log(`Data of ss-affiliates returned: ${datos.length}`);
                            // Devolvemos dichos datos, estado 200: OK
                            res.json(datos);
                            
                        }
                    }
            })
    });

//___________________________POSTS_____________________________________________


    //POST /ss-affiliates : Crear recurso
    app.post(`${BASE_API_URL_ss_affiliates}`, (req, res) => {

        //Guardamos el body de la request
        let newRecurse = req.body;

        //Comprobamos si tiene todos los campos
        if(!newRecurse.hasOwnProperty('province') || 
        !newRecurse.hasOwnProperty('year') || 
        !newRecurse.hasOwnProperty('ss_affiliation') ||
        !newRecurse.hasOwnProperty('n_cont_indef') || 
        !newRecurse.hasOwnProperty('n_cont_eventual') ||
        !newRecurse.hasOwnProperty('n_cont_temporary')){

            //Avisamos de que falta algun campo
            console.log('Falta algun dato');
            res.sendStatus(400);
        
        //Todos los campos están presentes
        }else{

            //Vamos a crear solo si no existe, para ellos buscamos el recurso
            db.find({'year': parseInt(newRecurse.year), 'province' : newRecurse.province}, (err, data) => {

                if(err){

                    //Error al buscar si existe dicho recurso, avisamos
                    console.log(`Error getting ss-affiliates/${newRecurse.province}/${newRecurse.year}: ${err}`);
                    res.sendStatus(500);

                //No hay errores, crear si no existe:
                }else if(data.length == 0){

                    //Modificamos el tipo de los valores al correcto
                    newRecurse.year = parseInt(newRecurse.year);
                    newRecurse.ss_affiliation = parseInt(newRecurse.ss_affiliation);
                    newRecurse.n_cont_indef = parseInt(newRecurse.n_cont_indef);
                    newRecurse.n_cont_temporary = parseInt(newRecurse.n_cont_temporary);
                    newRecurse.n_cont_eventual = parseInt(newRecurse.n_cont_eventual);

                    //Guardamos el nuevo dato
                    db.insert(newRecurse);

                    //Avisamos a consola y a usuario
                    console.log(`Created ${BASE_API_URL_ss_affiliates}/${newRecurse.province}/${newRecurse.year}`);
                    res.sendStatus(201);

                //Data.length no vacío, ya existe el recurso
                }else{

                    //El recurso a crear ya existe, avisamos
                    console.log(`Data ss-affiliates/${newRecurse.province}/${newRecurse.year} already exist`);
                    res.sendStatus(409);
                }
            });
        }
    });


    //POST NO PERMITIDO /ss-affiliates/province/year
    app.post(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {

        console.log('Metodo no permitido');
        // Estado 405: Not allowed
        res.sendStatus(405);
    });

    //POST NO PERMITIDO /ss-affiliates/province
    app.post(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {

        console.log('Metodo no permitido');
        // Estado 405: Not allowed
        res.sendStatus(405);
    });


//_________________________________DELETES________________________________

    //Delete ss-affiliates/province/year
    app.delete(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {

        // Inicializamos las variables
        let province = req.params.province;
        let year = req.params.year;

        // Contamos si existe algun recurso con esos datos
        db.count({'province': province, 'year': parseInt(year)}, (err, count) => {
            // Si hay error buscando 
            if(err){

                console.log(`Error ocurred finding ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                // Estado 500: Internal Server Error
                res.sendStatus(500);

            // Si no encuentra datos
            }else if(count == 0){

                console.log('Cant Removed a non existing resources');
                // Estado 404: Not Found
                res.sendStatus(404);
            
            // Si encuentra datos
            }else{

                // Borra el dato concreto que ha encontrado
                db.remove({'province': province, 'year': parseInt(year)}, {}, (err, num) => {

                    // Si hay error borrando
                    if(err){

                        console.log(`Error ocurred removing ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                        // Estado 500: Internal Server Error
                        res.sendStatus(500);

                    // Si no:
                    }else{

                        console.log(`Data removed: ${num}`);
                        // Estado 204: No Content
                        res.sendStatus(204);
                    }
                });
            }
        })
    });

    //Delete all data
    app.delete(`${BASE_API_URL_ss_affiliates}`, (req, res) => {

        db.remove({},  {multi:true}, (err, num) => {
            
            // Si hay error borrando
            if(err){

                console.log('Error deleting datas');
                // Estado 500: Internal Server Error
                res.sendStatus(500);
            
            // Si no se encuentran errores
            }else{

                console.log(`All data deleted: ${num}`);
                // Estado 204: No content
                res.sendStatus(204);
            }
        })
    })


//___________________________________PUTS________________________________

    //Put no permitido /ss-affiliates
    app.put(`${BASE_API_URL_ss_affiliates}`, (req, res) => {

        console.log('Metodo no permitido');
        // Estado 405: Not allowed
        res.sendStatus(405);

    });

    //Put no permitido a /ss-affiliates/province
    app.put(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {

        console.log('Metodo no permitido');
        // Estado 405: Not allowed
        res.sendStatus(405);
    });

    //Put correcto a /ss-affiliate/province/year
    app.put(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
        // Inicializamos las variables necesarias
        let province = req.params.province;
        let year = req.params.year;
        let modifRecurse = req.body;

        //Comprobamos si tiene todos los campos
        if(!modifRecurse.hasOwnProperty('province') || 
        !modifRecurse.hasOwnProperty('year') || 
        !modifRecurse.hasOwnProperty('ss_affiliation') ||
        !modifRecurse.hasOwnProperty('n_cont_indef') || 
        !modifRecurse.hasOwnProperty('n_cont_eventual') ||
        !modifRecurse.hasOwnProperty('n_cont_temporary')){

            //Avisamos de que falta algun campo
            console.log('Falta algun dato');
            res.sendStatus(400);
        
        //Todos los campos están presentes
        }else{

            //Comprobamos que el body coincide con los parámetros de la query
            if(modifRecurse.province != province || modifRecurse.year != year){

                console.log('Los datos no coinciden');
                res.sendStatus(400);

            //Si es asi, proseguimos
            }else{

                //Vamos a modificar solo si existe, para ellos buscamos el recurso
                db.find({'year': parseInt(year), 'province' : province}, (err, data) => {

                    if(err){

                        //Error al buscar si existe dicho recurso, avisamos
                        console.log(`Error getting ss-affiliates/${province}/${year}: ${err}`);
                        res.sendStatus(500);

                    //No hay errores, modificar si existe el dato:
                    }else if(data.length !== 0){

                        //Modificamos el tipo de los valores al correcto
                        modifRecurse.year = parseInt(modifRecurse.year);
                        modifRecurse.ss_affiliation = parseInt(modifRecurse.ss_affiliation);
                        modifRecurse.n_cont_indef = parseInt(modifRecurse.n_cont_indef);
                        modifRecurse.n_cont_temporary = parseInt(modifRecurse.n_cont_temporary);
                        modifRecurse.n_cont_eventual = parseInt(modifRecurse.n_cont_eventual);

                        
                        //Guardamos el nuevo dato
                        db.update({'province': province, 'year': parseInt(year)}, {'province' : province, 
                                                                                    'year': parseInt(year),
                                                                                    'ss_affiliation':parseInt(modifRecurse.ss_affiliation), 
                                                                                    'n_cont_indef':parseInt(modifRecurse.n_cont_indef), 
                                                                                    'n_cont_temporary': parseInt(modifRecurse.n_cont_temporary), 
                                                                                    'n_cont_eventual':parseInt(modifRecurse.n_cont_eventual)}, 
                                    {}, (err, num) => {

                            if(err){

                                console.log(`Error updating ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                                // Estado 500: Internal Server Error
                                res.sendStatus(500);

                            }else{

                                console.log(`Correctly Updated ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                                // Estado 200: Ok
                                res.sendStatus(200);
                            }
                        });

                    //Data.length vacío, no existe el recurso
                    }else{

                        //El recurso a modificar no existe, avisamos
                        console.log(`Data ss-affiliates/${province}/${year} not exist`);
                        // Estado 404: Not Found
                        res.sendStatus(404);
                    }
                
                });
            }
        }
    });
}

export { rvrv1 }