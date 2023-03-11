//_______________________________Constants and Requires__________________________________

const BASE_API_URL_ss_affiliates = `/api/v1/ss-affiliates`;
var Datastore = require(`nedb`);
var db = new Datastore();
var csvdata = require('csvdata');


//_____________________________________Export____________________________________________


module.exports = (app) => {

    // LoadInitialData
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

    //GET Lista Recursos
    app.get(`${BASE_API_URL_ss_affiliates}`, (req, res) => {
        let year = req.query.year;
        let from = req.query.from;
        let to = req.query.to;
        console.log(`New request to /ss-affiliates`);
        if(year != undefined){
            //Get por fecha
            console.log('Nueva peticion por fecha');
            db.find({'year' : parseInt(year)}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates?year=${year}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates?year=${year} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates?year=${year} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }else if(from !== undefined && to !== undefined){
            //Get por Rango de fechas
            console.log('Nueva peticion por rango de fecha');
            db.find({'year' : {$gte: parseInt(from), $lte: parseInt(to)}}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates?from=${from}&to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates?from=${from}&to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates?from=${from}&to=${to} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }else{
            //Get sin query
            db.find({}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`There aren't any data: ${data.length}`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }
        
    });


    //GET Recurso (First Province, Second Year)
    app.get(`${BASE_API_URL_ss_affiliates}/:province/:year`, (req, res) => {
        let year = req.params.year;
        let province = req.params.province;
        console.log(`New request to /ss-affiliates/${province}/${year}`);
        db.find({'year': parseInt(year), 'province' : province}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates/${province}/${year}: ${err}`);
                res.sendStatus(500);
            }else if(data.length == 0){
                console.log(`ss-affiliates/${province}/${year} not found`);
                res.sendStatus(404);
            }else{
                console.log(`Data ss-affiliates/${province}/${year} returned`);
                res.json(data.map((c) => {
                    delete c._id;
                    return(c);
                }));
            }
        });
    });

    //Get Recursos por provincia
    app.get(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {
        let province = req.params.province;
        let from = req.query.from;
        let to = req.query.to;
        console.log(`New request to /ss-affiliates/${province}`);
        if(from !== undefined && to !== undefined){
            //Get por provincia y rango de fechas
            db.find({'province' : province, year : {$gte: parseInt(from), $lte: parseInt(to)}}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?from=${from}&to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?from=${from}&to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?from=${from}&to=${to} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }else if(from !== undefined){
            // Get por provincia y fecha de inicio
            db.find({'province' : province, year : {$gte: parseInt(from)}}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?from=${from}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?from=${from} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?from=${from} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }else if(to !== undefined){
            // Get por provincia y fecha de fin
            db.find({'province' : province, year : {$lte: parseInt(to)}}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}?to=${to}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province}?to=${to} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province}?to=${to} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }else{
            // Get por provincia
            db.find({'province' : province}, (err, data) => {
                if(err){
                    console.log(`Error getting ss-affiliates/${province}: ${err}`);
                    res.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`ss-affiliates/${province} not found`);
                    res.sendStatus(404);
                }else{
                    console.log(`Data of ss-affiliates/${province} returned: ${data.length}`);
                    res.json(data.map((c) => {
                        delete c._id;
                        return(c);
                    }));
                }
            });
        }
    });


    //Get Recursos por year
    /*app.get(`${BASE_API_URL_ss_affiliates}`, (req, res) => {
        var year = req.query.year;
        console.log(`New request to /ss-affiliates?year=${year}`);
        db.find({'year' : year}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates?year=${year}: ${err}`);
                res.sendStatus(500);
            }else if(data.length == 0){
                console.log(`ss-affiliates?year=${year} not found`);
                res.sendStatus(404);
            }else{
                console.log(`Data of ss-affiliates?year=${year} returned: ${data.length}`);
                res.json(data.map((c) => {
                    delete c._id;
                    return(c);
                }));
            }
        });
    });

    //Get recursos por rango de fechas
    app.get(`${BASE_API_URL_ss_affiliates}`, (req, res) => {
        let from = req.query.from;
        let to = req.query.to;
        console.log(`New request to /ss-affiliates?from=${from}&to=${to}`);
        db.find({'year' : {$gte: from, $lte: to}}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates?from=${from}&to=${to}: ${err}`);
                res.sendStatus(500);
            }else if(data.length == 0){
                console.log(`ss-affiliates?from=${from}&to=${to} not found`);
                res.sendStatus(404);
            }else{
                console.log(`Data of ss-affiliates?from=${from}&to=${to} returned: ${data.length}`);
                res.json(data.map((c) => {
                    delete c._id;
                    return(c);
                }));
            }
        });
    });

    //Get Recursos de provincia por rango de fechas
    app.get(`${BASE_API_URL_ss_affiliates}/:province`, (req, res) => {
        let province = req.params.province;
        let from = req.params.from;
        let to = req.params.to;
        console.log(`New request to /ss-affiliates/${province}`);
        db.find({'province' : province, year : {$gte: from, $lte: to}}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates/${province}?from=${from}&to=${to}: ${err}`);
                res.sendStatus(500);
            }else if(data.length == 0){
                console.log(`ss-affiliates/${province}?from=${from}&to=${to} not found`);
                res.sendStatus(404);
            }else{
                console.log(`Data of ss-affiliates/${province}?from=${from}&to=${to} returned: ${data.length}`);
                res.json(data.map((c) => {
                    delete c._id;
                    return(c);
                }));
            }
        });
    });*/

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
