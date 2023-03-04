module.exports = amjc;

var array = [{year:2012, province:"Almería", gender:"Hombres", indefinite_contract:2741, single_construction_contract:15494,
    multiple_construction_contract:6002, single_eventual_contract:4743, multiple_eventual_contract:1856},
{year:2012, province:"Almería", gender:"Mujeres", indefinite_contract:2211, single_construction_contract:12581,
    multiple_construction_contract:5174, single_eventual_contract:5397, multiple_eventual_contract:2123},
{year:2012, province:"Cádiz", gender:"Hombres", indefinite_contract:4606, single_construction_contract:21563,
    multiple_construction_contract:12906, single_eventual_contract:13624, multiple_eventual_contract:9764},
{year:2012, province:"Cádiz", gender:"Mujeres", indefinite_contract:3995, single_construction_contract:11653,
    multiple_construction_contract:4187, single_eventual_contract:15247, multiple_eventual_contract:11675},
{year:2012, province:"Córdoba", gender:"Hombres", indefinite_contract:2927, single_construction_contract:15314,
    multiple_construction_contract:12061, single_eventual_contract:7376, multiple_eventual_contract:6809},
{year:2012, province:"Córdoba", gender:"Mujeres", indefinite_contract:2589, single_construction_contract:13588,
    multiple_construction_contract:8200, single_eventual_contract:9406, multiple_eventual_contract:8391},
{year:2012, province:"Granada", gender:"Hombres", indefinite_contract:3483, single_construction_contract:13617,
    multiple_construction_contract:6607, single_eventual_contract:11453, multiple_eventual_contract:9583},
{year:2012, province:"Granada", gender:"Mujeres", indefinite_contract:3486, single_construction_contract:10239,
    multiple_construction_contract:4699, single_eventual_contract:14200, multiple_eventual_contract:13309},
{year:2012, province:"Huelva", gender:"Hombres", indefinite_contract:1972, single_construction_contract:15383,
    multiple_construction_contract:13040, single_eventual_contract:3798, multiple_eventual_contract:2175},
{year:2012, province:"Huelva", gender:"Mujeres", indefinite_contract:1380, single_construction_contract:14092,
    multiple_construction_contract:8788, single_eventual_contract:4200, multiple_eventual_contract:2574},
{year:2012, province:"Jaén", gender:"Hombres", indefinite_contract:2245, single_construction_contract:12872,
    multiple_construction_contract:12801, single_eventual_contract:8332, multiple_eventual_contract:7650}];


function amjc(province, year){
    var filtrar_provincia = array.filter(n => n.province == "Cádiz" && n.year == 2012);
    var j = 0;
    for(var i=0;i<filtrar_provincia.length;i++){
        j+=filtrar_provincia[i].indefinite_contract;
    }
    var media_contratos_indefinidos = j / filtrar_provincia.length;
    var mensaje = `La media de contratos indefinidos entre hombres y mujeres en Cádiz durante el año 2012 fue de ${media_contratos_indefinidos} contratos.`
    return mensaje
}
