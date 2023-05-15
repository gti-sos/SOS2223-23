<svelte:head>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>
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
            "https://sos2223-13.appspot.com/api/v2/employment"
        );
        try{
            const valores = await res.json();
            let datos = valores.map(({region, year, employed_person, inactive_person, unemployed_person}) => 
                                    ({region, year, employed_person, inactive_person, unemployed_person}));
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
                type: 'cylinder',
                options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
                }
            },
            title: {
                text: 'Gráfica Datos Jose López (G13)'
            },
            xAxis: {
                categories: graph.map(n => n.year+"-"+n.region),
                title: {
                    margin: 50,
                    text: 'Año-Provincia'
                }
            },
            yAxis: {
                title: {
                    margin: 40,
                    text: 'Personas'
                }
            },
            tooltip: {
                headerFormat: '<b>Age: {point.x}</b><br>'
            },
            plotOptions: {
                series: {
                depth: 25,
                colorByPoint: true
                }
            },
            series: [{
                name: 'Personas Activas',
                data: graph.map(n => n.employed_person)
            }, {
                name: 'Personas Inactivas',
                data: graph.map(n => n.inactive_person)
            }, {
                name: 'Personas Desempleadas',
                data: graph.map(n => n.unemployed_person)
            }],
        });
    }
    
</script>

 
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>