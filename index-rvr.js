const csvdata = require('csvdata');


csvdata.load('./data/datos_rvr.csv').then((datos) => {
    principal(datos);
}).catch((error) => {
    console.log(error);
});



// =========================================FUNCIONES===================================================

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

    console.log(`El valor medio del dato ${attributeName} que buscamos para ${province} es ${filtrado.filtro.map((n) => {
        if (n.hasOwnProperty(attributeName)){
            return n[attributeName];
        }
    }).reduce((a,n) => {
        return a + n;
    })/filtrado.filtrados} \n`);
}
//Esta funcion inmediatamente imprime el dato por pantalla y nos lo muestra, a la vez que realiza el filtrado


//Esta última funcion es la que recopila todas las llamadas y los datos que queremos obtener cuando dispongamos de los datos
function principal(datos){

    filter_by_province_mean_log('Almeria', 'n_cont_eventual', datos);

    filter_by_province_mean_log('Almeria', 'ss_afiliation', datos);

    filter_by_province_mean_log('Almeria', 'n_cont_indef', datos);

    filter_by_province_mean_log('Almeria', 'n_cont_temporary', datos);
}