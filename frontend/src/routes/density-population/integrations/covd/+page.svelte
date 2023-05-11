<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let dataCov = [];

    let API = "/api/v2/covd";
        
    if(dev)
        API = 'http://localhost:12345'+API
    
    async function getData() {
        const res = await fetch(`${API}`, {
            method: 'GET'
        });
        try{
            const data = await res.json();
            dataCov = data.response.filter(n=>n.continent==="Europe" && n.country!="Russia" && n.population != null && n.deaths.total !=null)
            .map(({country,population, deaths}) => ({country,population, deaths}));
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }
        await delay(500);
        var totalPopulation = dataCov.reduce((acc, b)=> {return acc + b.population;}, 0);
        loadChart(totalPopulation);
    };

    async function loadChart(totalPopulation){
        Highcharts.chart('container', {
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },
            title: {
                text: 'Relacion entre muertes por covid y poblacion total de los paises europeos'
            },
            xAxis: {
                title: {
                text: 'Poblacion total'
                },
                labels: {
                format: '{value}'
                }
            },
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                text: 'Muertes por covid'
                },
                labels: {
                format: '{value}'
                },
                maxPadding: 0.2
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                '<tr><th>Población:</th><td>{point.x}</td></tr>' +
                '<tr><th>Casos:</th><td>{point.y}</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },
            plotOptions: {
                series: {
                    showInLegend:false,
                    dataLabels: {
                        enabled: true,
                        format: '{point.country}'
                    },
                    bubble: {
                        minSize: 5,
                        maxSize: 50,
                    }
                }
            },
            legend:{
                enable:false
            },
            series: [{
                colorByPoint: true,
                data: dataCov.map(function(point) {
                    return {
                        x: point.population,
                        y: point.deaths.total,
                        z: (point.deaths.total / totalPopulation) * 200,
                        country: point.country
                    };
                })
            }]
        });

    }


    onMount(async () =>{
        getData();
    });
</script>

<main>
    <div id="container"></div>
    <p>Este es un uso de API externa</p>
</main>