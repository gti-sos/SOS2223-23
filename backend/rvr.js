//_______________________________Constants and Requires__________________________________

const BASE_API_URL_ss_affiliates = `/api/v1/ss-affiliates`;
var Datastore = require(`nedb`);
var db = new Datastore();
var csvdata = require('csvdata');


//_____________________________________Export____________________________________________


module.exports = (app) => {

//___________________________________GETS__________________________________


    app.get(`${BASE_API_URL_ss_affiliates}/docs`, (req, res) => {
        console.log('Redirecting to documentation site');
        res.status(301).redirect("https://documenter.getpostman.com/view/25997396/2s93JzKfdw");
    });

    // GET LoadInitialData
    app.get(`${BASE_API_URL_ss_affiliates}/loadInitialData`, (req, res) => {
        console.log(`New Request to /loadInitialData.`);
        db.find({}, async (err, data) => {
            if(err){
                console.log(`Error loading Initial Data: ${err}.`);
                res.sendStatus(500);
            }else if(data.length != 0){
                console.log(`There are data ${data.length} loaded.`);
                res.sendStatus(200);
            }else{
                let datos = await csvdata.load('./data/datos_rvr.csv');
                db.insert(datos);
                console.log(`Inserted ${datos.length} data in the database.`);
                res.sendStatus(201);
            }
        });
    });

    //GET /ss-affiliates: Lista de Recursos
    app.get(`${BASE_API_URL_ss_affiliates}`, (req, res) => {
        console.log(`New request to /ss-affiliates`);
        db.find({}, {_id: 0}, (err, data) => {
                    if(err){
                        console.log(`Error getting ss-affiliates`);
                        res.sendStatus(500);
                    }else if(data.length == 0){
                        console.log(`ss-affiliates not found`);
                        res.sendStatus(404);
                    }else{
                        let i = -1;
                        if(!req.query.offset){ var offset = 0;}else{ var offset = parseInt(req.query.offset);}
                        datos = data.filter((x) => {
                            return (((req.query.year == undefined)||(parseInt(req.query.year) === x.year))&&
                            ((req.query.from == undefined)||(parseInt(req.query.from) <= x.year))&&
                            ((req.query.to == undefined)||(parseInt(req.query.to) >= x.year))&&
                            ((req.query.province == undefined)||(req.query.province === x.province))&&
                            ((req.query.ss_affiliation == undefined)||(parseInt(req.query.ss_affiliation) === x.ss_affiliation))&&
                            ((req.query.n_cont_temporary == undefined)||(parseInt(req.query.n_cont_temporary) === x.n_cont_temporary))&&
                            ((req.query.n_cont_indef == undefined)||(parseInt(req.query.n_cont_indef) === x.n_cont_indef))&&
                            ((req.query.n_cont_eventual == undefined)||(parseInt(req.query.n_cont_eventual) == x.n_cont_eventual)));

                        }).filter((x) => {
                            i = i+1;
                            if(req.query.limit==undefined){ var cond = true;}else{ var cond = (offset + parseInt(req.query.limit)) >= i;}
                            return (i>offset)&&cond;
                        });
                        res.json(datos);
                        console.log(`Data of ss-affiliates returned: ${datos.length}`);
                    }
            })

        /*if(year != undefined){
            //Get por fecha
            console.log('Nueva peticion por fecha');
            db.find({'year' : parseInt(year)}, {_id : 0}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates?year=${year}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates?year=${year} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates?year=${year} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }else if(from !== undefined && to !== undefined){
            //Get por Rango de fechas
            console.log('Nueva peticion por rango de fecha');
            db.find({'year' : {$gte: parseInt(from), $lte: parseInt(to)}}, {_id : 0}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates?from=${from}&to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates?from=${from}&to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates?from=${from}&to=${to} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }else{
            //Get sin query
            db.find({}, {_id : 0},  (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`There aren't any data: ${data.length}`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data returned: ${data.length}`);
                    res.json(data);
                }
            });
        }
        */
    });


    //GET /ss-affiliates/province/year (First Province, then Year): Recurso único
    app.get(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
        let year = req.params.year;
        let province = req.params.province;
        console.log(`New request to /ss-affiliates/${province}/${year}`);
        db.find({'year': parseInt(year), 'province' : province}, {_id : 0}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates/${province}/${year}: ${err}`);
                res.sendStatus(500);
            }else if(data.length == 0){
                console.log(`ss-affiliates/${province}/${year} not found`);
                res.sendStatus(404);
            }else{
                console.log(`Data ss-affiliates/${province}/${year} returned`);
                res.json(data);
            }
        });
    });

    //GET /ss-affiliates/province: Recursos por provincia
    app.get(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {
        let province = req.params.province;
        let from = req.query.from;
        let to = req.query.to;
        console.log(`New request to /ss-affiliates/${province}`);
        if(from !== undefined && to !== undefined){
            //Get por provincia y rango de fechas
            db.find({'province' : province, year : {$gte: parseInt(from), $lte: parseInt(to)}}, {_id : 0}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?from=${from}&to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?from=${from}&to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?from=${from}&to=${to} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }else if(from !== undefined){
            // Get por provincia y fecha de inicio
            db.find({'province' : province, year : {$gte: parseInt(from)}}, {_id : 0}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?from=${from}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?from=${from} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?from=${from} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }else if(to !== undefined){
            // Get por provincia y fecha de fin
            db.find({'province' : province, year : {$lte: parseInt(to)}}, {_id : 0}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?to=${to} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }else{
            // Get por provincia
            db.find({'province' : province}, {_id : 0} , (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province} returned: ${data.length}`);
                    res.json(data);
                }
            });
        }
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
        res.sendStatus(405);
    });

    //POST NO PERMITIDO /ss-affiliates/province
    app.post(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {
        console.log('Metodo no permitido');
        res.sendStatus(405);
    });


//_________________________________DELETES________________________________

    //Delete ss-affiliates/province/year
    app.delete(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
        let province = req.params.province;
        let year = req.params.year;
        db.count({'province': province, 'year': parseInt(year)}, (err, count) => {
            if(err){
                console.log(`Error ocurred finding ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                res.sendStatus(500);
            }else if(count == 0){
                console.log('Cant Removed a non existing resources');
                res.sendStatus(404);
            }else{
                db.remove({'province': province, 'year': parseInt(year)}, {}, (err, num) => {
                    if(err){
                        console.log(`Error ocurred removing ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                        res.sendStatus(500);
                    }else{
                        console.log(`Data removed: ${num}`);
                        res.sendStatus(204);
                    }
                });
            }
        })
    });

    //Delete all data
    app.delete(`${BASE_API_URL_ss_affiliates}`, (req, res) => {

        db.remove({},  {multi:true}, (err, num) => {
            if(err){
                console.log('Error deleting datas');
                res.sendStatus(500);
            }else{
                console.log(`All data deleted: ${num}`);
                res.sendStatus(204);
            }
        })
    })


//___________________________________PUTS________________________________

    //Put no permitido /ss-affiliates
    app.put(`${BASE_API_URL_ss_affiliates}`, (req, res) => {
        console.log('Metodo no permitido');
        res.sendStatus(405);
    });

    //Put no permitido a /ss-affiliates/province
    app.put(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {
        console.log('Metodo no permitido');
        res.sendStatus(405);
    });

    //Put correcto a /ss-affiliate/province/year
    app.put(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
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
                                res.sendStatus(500);
                            }else{
                                console.log(`Correctly Updated ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                                res.sendStatus(200);
                            }
                        });

                    //Data.length vacío, no existe el recurso
                    }else{

                        //El recurso a modificar no existe, avisamos
                        console.log(`Data ss-affiliates/${province}/${year} not exist`);
                        res.sendStatus(404);
                    }
                
                });
            }
        }
    });

}
