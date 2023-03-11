//_______________________________Constants and Requires__________________________________

const BASE_API_URL_ss_affiliates = `/api/v1/ss-affiliates`;
var Datastore = require(`nedb`);
var db = new Datastore();
var csvdata = require('csvdata');


//_____________________________________Export____________________________________________


module.exports = (app) => {

//___________________________________GETS__________________________________

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
        let year = req.query.year;
        let from = req.query.from;
        let to = req.query.to;
        console.log(`New request to /ss-affiliates`);
        if(year != undefined){
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
        !newRecurse.hasOwnProperty('ss_afiliation') ||
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
                    newRecurse.ss_afiliation = parseInt(newRecurse.ss_afiliation);
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

    app.delete(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
        let province = req.params.province;
        let year = req.params.year;

        db.remove({'province': province, 'year': parseInt(year)}, {}, (err, num) => {
            if(err){
                console.log(`Error ocurred removing ${BASE_API_URL_ss_affiliates}/${province}/${year}`);
                res.sendStatus(500);
            }else{
                console.log(``)
            }
        })
    });





    // Samples
    app.get('/samples/rvr', (req, res)=>{
        let province = 'almeria';
        let attributeName = 'n_cont_indef'
        csvdata.load('./data/datos_rvr.csv').then((datos) => {
            let media = rvr(province, attributeName, datos);
            res.json(`El valor de la media de los datos ${attributeName} para la provincia ${province} es: ${media}`);
        }).catch((error) => {
            console.log(error);
            res.json(500);
        });
        console.log('New Request to /samples/rvr');
    });

};


// _____________________________________Funciones________________________________________



//Con esta funcion hacemos el filtro por provincias de manera que se pueda cambiar llegado el momento
function province_filter(list, province){
    lista = list.filter((n) => {
        return n.province == province;
    });

    return { 
        filtro : lista,
        filtrados : lista.length
            };
}
//La funcion devuelve un diccionario con el array de filtrados y el numero de filtrados
//Para hacer una única vez el filtrado lo realizamos aquí y ya accedemos a sus valores


// Con esta funcion devolvemos el resultado de hacer la media filtrada por provincia de los datos solicitados 
function rvr(province, attributeName, datos){

    let filtrado = province_filter(datos, province);

    return filtrado.filtro.map((n) => {
        if (n.hasOwnProperty(attributeName)){
            return n[attributeName];
        }
    }).reduce((a,n) => {
        return a + n;
    })/filtrado.filtrados;
}
//Esta funcion devuelve el dato, a la vez que realiza el filtrado
