<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/density-population';    
    if(dev)
        API = 'http://localhost:12345'+API

    let density=[];
    let result = "";
    let resultStatus = "";

    async function loadChart(graphData){
        graphData.sort((a, b) => {
            if (b.year !== a.year) {
                // ordena primero por year de mayor a menor
                return a.year - b.year; 
            } else {
                // si el year es igual, ordena por province en orden alfabético
                return a.gender.localeCompare(b.gender); 
            }
            });
        const categories = graphData.map(item => `${item.year} - ${item.province} - ${item.gender}`);

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Densidad de poblacion en Andalucia'
            },
            xAxis: {
                categories: categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                max:80,
                title: {
                text: 'Densidad de población'
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
                name: 'Municipality size < 5,000',
                data: graphData.map(item => item.municipality_size_lt_ft)
            }, {
                name: 'Municipality size 5,000-50,000',
                data: graphData.map(item => item.municipality_size_bt_ft_tht)
            }, {
                name: 'Municipality size > 50,000',
                data: graphData.map(item => item.municipality_size_gt_tht)
            }, {
                name: 'Capital size',
                data: graphData.map(item => item.capital_size)
            }]
        });
    }

    async function getData() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: 'GET'
        });
        try{
            const dataReceived = await res.json();
            result = JSON.stringify(dataReceived,null,2);
            density = dataReceived;
            loadChart(density);
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;	
            
    }

    onMount(async () =>{
        getData();
    })




    
</script>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
      </figure>
</main>