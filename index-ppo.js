var array_data = [
    {year:2012,province:"Almería",gender:"Hombres",municipality_size_lf_ft:14.78,municipality_size_bt_ft_tht:22.40,
    municipality_size_gt_tht:36.91,capital_size:25.90},
    {year:2012,province:"Almería",gender:"Mujeres",municipality_size_lf_ft:14.76,municipality_size_bt_ft_tht:22.23,
    municipality_size_gt_tht:34.49,capital_size:28.52},
    {year:2012,province:"Cádiz",gender:"Hombres",municipality_size_lf_ft:2.12,municipality_size_bt_ft_tht:13.69,
    municipality_size_gt_tht:74.66,capital_size:9.53},
    {year:2012,province:"Cádiz",gender:"Mujeres",municipality_size_lf_ft:2.00,municipality_size_bt_ft_tht:13.21,
    municipality_size_gt_tht:74.42,capital_size:10.37},
    {year:2012,province:"Córdoba",gender:"Hombres",municipality_size_lf_ft:13.81,municipality_size_bt_ft_tht:23.14,
    municipality_size_gt_tht:23.06,capital_size:40.00},
    {year:2012,province:"Córdoba",gender:"Mujeres",municipality_size_lf_ft:13.28,municipality_size_bt_ft_tht:22.50,
    municipality_size_gt_tht:22.50,capital_size:41.72},
    {year:2012,province:"Granada",gender:"Hombres",municipality_size_lf_ft:21.15,municipality_size_bt_ft_tht:35.33,
    municipality_size_gt_tht:19.15,capital_size:24.36},
    {year:2012,province:"Granada",gender:"Mujeres",municipality_size_lf_ft:19.60,municipality_size_bt_ft_tht:34.06,
    municipality_size_gt_tht:18.95,capital_size:27.40},
    {year:2012,province:"Huelva",gender:"Hombres",municipality_size_lf_ft:20.02,municipality_size_bt_ft_tht:30.33,
    municipality_size_gt_tht:22.03,capital_size:27.63},
    {year:2012,province:"Huelva",gender:"Mujeres",municipality_size_lf_ft:19.55,municipality_size_bt_ft_tht:29.79,
    municipality_size_gt_tht:21.47,capital_size:29.19}
];

function filter_by_province(provincia,parametro,array){
    var lista =  array.filter((elem) => {
        return elem.province === provincia ;
    }).map((elem) =>{
        return elem[parametro];
    })
    var resultado = lista.reduce((a,b)=>{
        return ((a+b) / lista.length);
    })
    return resultado
}

function return_result(){
    campo_1=filter_by_province("Huelva","municipality_size_lf_ft",array_data);
    campo_2=filter_by_province("Huelva","municipality_size_bt_ft_tht",array_data);
    campo_3=filter_by_province("Huelva","municipality_size_gt_tht",array_data);
    campo_4=filter_by_province("Huelva","capital_size",array_data);
    var mensaje = `Dada la provincia elegida la media de valores para el campo Municipality_size_lf_ft es de: ${campo_1} 
    Para el campo Municipality_size_bt_ft_tht es de: ${campo_2} 
    Para el campo Municipality_size_gt_tht es de: ${campo_3} 
    Y para el campo Capital_size es de ${campo_4}`
    return mensaje
}

module.exports = return_result;