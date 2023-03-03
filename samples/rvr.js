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
