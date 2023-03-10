//_______________________________Constants and Requires__________________________________

const BASE_API_URL_ss_affiliates = `/api/v1/ss-affiliates`;
var Datastore = require(`nedb`);
var db = new Datastore();
var csvdata = require('csvdata');


//_____________________________________Export____________________________________________


module.exports = (app) => {
    
    // Samples
    app.get('/samples/rvr', (req, res)=>{
        let province = 'Almeria';
        let attributeName = 'n_cont_indef'
        csvdata.load('./data/datos_rvr.csv').then((datos) => {
            let media = rvr(province, attributeName, datos);
            res.json(`El valor de la media de los datos ${attributeName} para la provincia ${province} es: ${media}`);
        }).catch((error) => {
            res.json(error);
        });
        console.log('New Request to /samples/rvr');
    });

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
        console.log(`New request to /ss-affiliates`);
        db.find({}, (err, data) => {
            if(err){
                console.log(`Error getting ss-affiliates: ${err}`);
                res.sendStatus(500);
            }else{
                console.log(`Data returned: ${data.length}`);
                res.json(data.map((c) => {
                    delete c._id;
                    return(c);
                }));
            }
        });
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
                }))
            }
        });
    });

}
// _____________________________________Funciones_______________________________________



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
