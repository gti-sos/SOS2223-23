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

    const API = 'https://fia-formula-1-championship-statistics.p.rapidapi.com/api/teams';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4e84fcead5msh2c5615507183a12p16c783jsn73fec713d82b',
            'X-RapidAPI-Host': 'fia-formula-1-championship-statistics.p.rapidapi.com'
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
            let datos = valores.teams.map(({teamName, points}) => ({teamName, points}));
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
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: graph.map(n => n.teamName),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                pointPadding: 0.2,
                borderWidth: 0
                }
            },
            series: [{
                name: 'Puntos',
                data: graph.map(n => n.points.pts)
            }]
        });
    }
    
</script>

 
<main>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container"></div>
    </figure>
</main>