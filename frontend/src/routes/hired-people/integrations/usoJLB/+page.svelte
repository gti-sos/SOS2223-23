<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
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

    let API = '/api/v2/hired-people';    
    if(dev)
        API = 'http://localhost:12345'+API;

    const delay = ms => new Promise(res => setTimeout(res, ms));
    let graph = [];
    let provincia_año = [];
    let employed_person = [];
    let inactive_person = [];
    let unemployed_person = [];
    onMount(async () =>{
        getGraph()
    });
    async function getGraph(){
            const res = await fetch(
                "https://sos2223-13.appspot.com/api/v2/employment"
            );
            if(res.ok){
                    const valores = await res.json();
                    graph = valores;
                    graph.forEach(graph =>{
                        provincia_año.push(graph.region+"-"+graph.year);
                        employed_person.push(graph["employed_person"]);
                        inactive_person.push(graph["inactive_person"]);
                        unemployed_person.push(graph["unemployed_person"]);
                        
                    });
                    await delay(500);
                    loadChart(); 
            }else{
                console.log("Error al cargar la gráfica");
            }
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
                text: 'Gráfica Datos Jose López'
            },
            xAxis: {
                categories: provincia_año,
                title: {
                    text: 'Provincia-Año'
                }
            },
            yAxis: {
                title: {
                    margin: 20,
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
                data: employed_person 
            }, {
                name: 'Personas Inactivas',
                data: inactive_person 
            }, {
                name: 'Personas Desempleadas',
                data: unemployed_person 
            }],
        });
    }
    
</script>

 
<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>