<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>


<script>
// @ts-nocheck
    import { onMount } from "svelte";
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let dataGraph = [];
    let territory = [];
    let total_population = [];
    let under_sixteen_years = [];

    let loadInitial = "https://sos2223-13.appspot.com/api/v2/evolution/loadInitialData";
    let API = "https://sos2223-13.appspot.com/api/v2/evolution";
    onMount(async () =>{
        getData()
    });

    async function getData() {
        const initial = await fetch(loadInitial);
        if (initial.ok){
            const res = await fetch(API, {
            method: 'GET'
            });
            try{
                const dataReceived = await res.json();
                dataGraph = dataReceived;
                var data1980 = dataGraph.filter((n)=>{
                    return n.period === 1980;
                })
                console.log(data1980);
                data1980.forEach(data1980 =>{
                    //period.push(dataGraph["period"]);
                    territory.push(data1980["territory"]);
                    total_population.push(data1980["total_population"]);
                    //man.push(dataGraph["man"]);
                    //woman.push(dataGraph["woman"]);
                    under_sixteen_years.push(data1980["under_sixteen_years"]);
                    //from_sixteen_to_sixty_four_years.push(dataGraph["from_sixteen_to_sixty_four_years"]);
                    //sixty_five_and_over.push(dataGraph["sixty_five_and_over"]);
                    });                
                await delay(500);  
                loadChart(data1980); 
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
        } else{
            console.log("Error cargando los datos")
        }
        

    };

    async function loadChart(){  
        // const territory = data1980.map(item => `${item.territory}`);
        // console.log(territory)

        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Población total y población menor de 16 años por provincia en 1980'
            },
            xAxis: {
                categories: territory
            },
            yAxis: {
                title: {
                    text: 'Población'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Menor de 16 años',
                data: under_sixteen_years
            }, {   
                name: 'Poblacion Total',
                data: total_population
            }]}
    )}; 
</script>
<main>
    <figure class="highcharts-figure" style="margin-left: 15px; margin-right:35px">
        <div id="container"></div>
        <div class="context">
            <p>Uso de la API de compañero de SOS: 'Evolution-Stats'</p>
        </div>
    </figure>
</main>