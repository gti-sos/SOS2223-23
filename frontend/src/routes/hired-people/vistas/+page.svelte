<svelte:head>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src='https://cdn.plot.ly/plotly-2.20.0.min.js'></script>
</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/hired-people';    
    if(dev)
        API = 'http://localhost:12345'+API;

    let hired=[];

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
                type: 'bar'
            },
            title: {
                text: 'Personas contratadas en Andalucía'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Contratos',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineWidth: 0
            },
            tooltip: {
                valueSuffix: ' contratos'
            },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.1
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Contratos Indefinidos',
                data: graphData.map(item => parseInt(item.indefinite_contract))
            }, {
                name: 'Contratos Únicos de Construcción',
                data: graphData.map(item => parseInt(item.single_construction_contract))
            }, {
                name: 'Contratos Múltiples de Construcción',
                data: graphData.map(item => parseInt(item.multiple_construction_contract))
            }, {
                name: 'Contratos Únicos Eventuales',
                data: graphData.map(item => parseInt(item.single_eventual_contract))
            }, {
                name: 'Contratos Múltiples Eventuales',
                data: graphData.map(item => parseInt(item.multiple_eventual_contract)) 
            }]
        });
    }

    async function loadPlotly(graphData){
        let prov_hombres = graphData.filter(x => x.province === 'Sevilla' && x.gender === 'Hombres');
        let prov_mujeres = graphData.filter(x => x.province === 'Sevilla' && x.gender === 'Mujeres');
        var trace_indefinite_contract_hombres = {
            x: prov_hombres.map(item => parseInt(item.year)),
            y: prov_hombres.map(item => parseInt(item.indefinite_contract)),
            type: 'bar',
            name: 'Hombres'
        };
        var trace_indefinite_contract_mujeres = {
            x: prov_mujeres.map(item => parseInt(item.year)),
            y: prov_mujeres.map(item => parseInt(item.indefinite_contract)),
            type: 'bar',
            name: 'Mujeres'
        };
        
        var data = [trace_indefinite_contract_hombres, trace_indefinite_contract_mujeres];
        var layout = {
            title: 'Contratos Indefinidos en Sevilla',
            barmode: 'group'
        };
        Plotly.newPlot('myDiv', data, layout);
    }

    async function getData() {
        const res = await fetch(API, {
            method: 'GET'
        });
        try{
            const dataReceived = await res.json();
            hired = dataReceived;
            loadChart(hired);
            loadPlotly(hired);
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }	   
    };


    onMount(async() => {
        getData();
    })

</script>


<main>
    <h1>Visualización Personas Contratadas en Andalucía</h1>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
    <div id='myDiv'></div>
</main>


<style>
    .highcharts-figure,
    
    #container {
    height: 4000px;
    }
</style>
