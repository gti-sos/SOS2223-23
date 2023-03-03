const csvdata = require('csvdata');

function rvr(){
    csvdata.load('./data/datos_rvr.csv').then((datos) => {
        let dato = filter_by_province_mean_log('Almeria', 'n_cont_indef', datos);
        return(dato)
    }).catch((error) => {
        console.log(error);
    });
}
var dato = rvr();

console.log(dato);

module.exports = rvr;

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


// Con esta funcion mostramos por pantalla el resultado de hacer la media filtrada por provincia de los datos solicitados 
function filter_by_province_mean_log(province, attributeName, datos){

    let filtrado = province_filter(datos, province);

    return filtrado.filtro.map((n) => {
        if (n.hasOwnProperty(attributeName)){
            return n[attributeName];
        }
    }).reduce((a,n) => {
        return a + n;
    })/filtrado.filtrados;
}
//Esta funcion inmediatamente imprime el dato por pantalla y nos lo muestra, a la vez que realiza el filtrado
