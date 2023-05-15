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
    onMount(async () =>{
        getGraph()
    });
    async function getGraph(){
            const res = await fetch(
                "https://sos2223-21.appspot.com/api/v3/market-prices-stats/"
            );
            try{
            const valores = await res.json();
            let datos = valores.map(({province, year, pib_variation_rate, pib_percentage_structure}) => 
                                    ({province, year, pib_variation_rate, pib_percentage_structure}));
            graph = datos;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            await delay(500);
            loadChart(); 
    }
    async function loadChart(){  
        Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Gráfica Datos Jorge Florentino (G21)',
            style: {
                fontWeight: 'bold',
                fontFamily: 'Times New Roman',
                fontSize: 40,
            },
        },
        
        xAxis: {
            title:{
                text: "Año-Provincia",
                style: {
                    fontWeight: 'bold'
                }
            },
            categories: graph.map(n => n.year+"-"+n.province),
            crosshair: true
        },
        yAxis: {
            min: -10,
            max: 30,
            title: {
                text: 'Datos',
                style: {
                    fontWeight: 'bold'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y: 2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
            pointPadding: 0.2,
            borderWidth: 2,
            borderColor: "#000"
            }
        },
        series: [{
            name: 'Ratio de Variación del PIB',
            data: graph.map(n => n.pib_variation_rate) 
        }, {
            name: 'Estructura de porcentaje del PIB',
            data: graph.map(n => n.pib_percentage_structure)  
        }],
        responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1000
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }
</script>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>