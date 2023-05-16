<svelte:head>
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

    const API = 'https://volleyball-data.p.rapidapi.com/team/schedule?teamId=1050';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4e84fcead5msh2c5615507183a12p16c783jsn73fec713d82b',
            'X-RapidAPI-Host': 'volleyball-data.p.rapidapi.com'
        }
    };

    onMount(async () =>{
        getData();
    });

    async function getData(){
        const res = await fetch(API, options, {
            method: "GET"
        });
        try{
            const valores = await res.json();
            console.log(valores);
            let datos = valores.map(({homeTeam}) => ({homeTeam}));
            graph = datos;
            console.log(graph);
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }
        await delay(500);
        loadChart(); 
    }
    async function loadChart(){  
        Highcharts.chart('container', {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Volleyball Data',
                align: 'left'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 120,
                y: 70,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                categories: graph.map(n => n.homeTeam.mediumName),
                title: {
                text: 'Nombre Equipo'
                }
            },
            yAxis: {
                title: {
                text: 'Puntuación'
                }
            },
            tooltip: {
                shared: true,
                headerFormat: '<b>Puntuacion de {point.x} en el set 1</b><br>'
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Puntuación',
                data: graph.map(n => n.homeTeam.score.set1)
            }]
        });
    }
</script> 


 
<main>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container"></div>
    </figure>
</main>