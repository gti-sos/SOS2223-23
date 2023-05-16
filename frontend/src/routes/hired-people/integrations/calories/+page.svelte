<svelte:head>
    <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    const delay = ms => new Promise(res => setTimeout(res, ms));
    let graph = [];
/*
    const API = 'https://calories-burned-by-api-ninjas.p.rapidapi.com/v1/caloriesburned?activity=skiing';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4e84fcead5msh2c5615507183a12p16c783jsn73fec713d82b',
            'X-RapidAPI-Host': 'calories-burned-by-api-ninjas.p.rapidapi.com'
        }
    };
*/
    let API = "/api/v2/calories";
        
    if(dev)
        API = 'http://localhost:12345'+API

    onMount(async () =>{
        getData();
    });

    async function getData(){
        const res = await fetch(`${API}`, {
            method: "GET"
        });
        try{
            const valores = await res.json();
            console.log(valores);
            let datos = valores.map(({name, total_calories, calories_per_hour}) => ({name, total_calories, calories_per_hour}));
            graph = datos;
            console.log(graph);
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }
        await delay(500);
        loadChart(); 
    }
    async function loadChart(){
        const seriesData = graph.map(({ name, total_calories, calories_per_hour }) => ({
            name,
            y: total_calories,
            z: calories_per_hour
        }));
        Highcharts.chart('container', {
            chart: {
                type: 'variablepie'
            },
            title: {
                text: 'Calorias consumidas por Ejercicio',
                align: 'center'
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'Calorias totales: <b>{point.y} (cal)</b><br/>' +
                'Calorias por hora: <b>{point.z} (cal)</b><br/>'
            },
            series: [{
                minPointSize: 10,
                innerSize: '20%',
                zMin: 0,
                name: 'Ejercicio',
                borderRadius: 5,
                data: seriesData,
                colors: [
                '#4caefe',
                '#3dc3e8',
                '#2dd9db',
                '#1feeaf',
                '#0ff3a0',
                '#00e887',
                '#23e274',
                '#22e932',
                '#1fcea2'
                ]
                
            }]
        });  
    }
</script>
 
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>