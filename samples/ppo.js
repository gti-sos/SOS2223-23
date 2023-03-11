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
            //GET total
        app.get(BASE_API_URL+'/density-population', (request,response)=>{
            console.log('New request to /density-population');
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
        });
            //GET específico
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
                    res.sendStatus(404);
                }else{
                    console.log(`Data of density-population/${year}/${province}/${gender} returned`);
                    res.json(docs.map((c) => {
                        delete c._id;
                        return(c);
                    }))
                }
            });
        });
            //GET para cargar datos
        app.get(BASE_API_URL+'/density-population/loadInitialData', (req, res) => {
            console.log(`New Request to /loadInitialData.`);
            db.find({}, async (err, docs) => {
                if(err){
                    console.log(`Error loading initial Data: ${err}.`);
                    res.sendStatus(500);
                }else if(docs.length!=0){
                    console.log(`Data is already stored.`);
                    res.sendStatus(200);
                }else{
                    let datos = ppo_samples.array_data
                    db.insert(datos);
                    console.log(`Inserted data in the database.`);
                    res.sendStatus(201);
                }
            });
        });
        //Todos los DELETE
            //Delete específico
        app.delete(BASE_API_URL+"/density-population/:year/:province/:gender", (request,response) => {
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            console.log(`New DELETE to`);
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
    }
}