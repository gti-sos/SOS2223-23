<svelte:head>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>
    <script src="https://code.highcharts.com/modules/funnel3d.js"></script>
    <script src="https://code.highcharts.com/modules/pyramid3d.js"></script>
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

    const API = 'https://basketball-data.p.rapidapi.com/team/schedule?teamId=1442';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '4e84fcead5msh2c5615507183a12p16c783jsn73fec713d82b',
            'X-RapidAPI-Host': 'basketball-data.p.rapidapi.com'
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
                type: 'pyramid3d',
                options3d: {
                enabled: true,
                alpha: 10,
                depth: 50,
                viewDistance: 50
                }
            },
            title: {
                text: 'Puntos Final Partido Baloncesto'
            },
            xAxis: {
                categories: graph.map(n => n.homeTeam.name),
            },
            plotOptions: {
                series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.xAxis}</b> ({point.y:,.0f})',
                    allowOverlap: true,
                    x: 10,
                    y: -5
                },
                width: '60%',
                height: '80%',
                center: ['50%', '45%']
                }
            },
            series: [{
                name: 'Puntos',
                data: graph.map(n => n.homeTeam.score.regular)
            }]
        });
    }
</script> 
 
<main>
    <figure class="highcharts-figure" style="margin-left: 25px; margin-right:25px">
        <div id="container"></div>
    </figure>
</main>