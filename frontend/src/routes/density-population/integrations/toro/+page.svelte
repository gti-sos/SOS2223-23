<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.6.2"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</svelte:head>

<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res, ms));
    let dataToro = [];
    let dataApi = [];
    let APItoro = "https://datos.juntadeandalucia.es/api/v0/places/option-values/place_provinces";
    let API = "https://sos2223-23.appspot.com/api/v2/density-population";

    onMount(async () =>{
        getData();
    });

    async function getData() {
        const res = await fetch(APItoro, {
            method: 'GET'
        });
        try{
            const dataToroReceived = await res.json();
            dataToro = dataToroReceived.stats;
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }	
        const loadData = await fetch(API+"/loadInitialData");
        if(loadData.ok){
            const res2 = await fetch(API, {
            method: 'GET'
            });
            try{
                const dataReceived = await res2.json();
                let filtro = dataReceived.filter((n) => {
                    return n.year === 2022 && n.province !=="Andalucía";
                }).reduce((acc, b) => {
                    let key = b.province;
                    let existingObj = acc.find((obj) => obj.province === key);
                    if (existingObj) {
                        existingObj.capital_size =
                        (existingObj.capital_size + b.capital_size) / 2;
                    } else {
                        acc.push({
                            year:b.year,
                            province:b.province,
                            capital_size: b.capital_size
                        });
                    }
                    return acc;
                }, []);
                dataApi = filtro;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }	   
            await delay(500);
            loadChart();
        }
        
    };

    async function loadChart(){
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
            labels: dataApi.map(n => n.province),
            datasets: [{
                label: 'Densidad de población',
                data: dataApi.map(n=>n.capital_size),
                backgroundColor: ['blue'],
                borderWidth: 1
            },{
                label: 'Número Escuelas Taurinas',
                data: dataToro.map(n=>n.doc_count),
                backgroundColor: ['orange'],
                borderWidth: 1
            }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend:{
                        position: 'top',
                        
                    },
                    title:{
                        text: "Número de escuelas taurinas por densidad de poblacion en las provincias andaluzas",
                        display: true,
                        color: 'black',
                        font:{
                            family: 'Arial',
                            size: 30,
                            weight: 'bold',
                        },
                        padding: {
                            bottom: 15
                        }
                    },
                    subtitle: {
                        display: true,
                        text: 'Gráfica con Chart.js',
                        color: 'black',
                        font: {
                            size: 15,
                            family: 'Arial',
                            
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                        y: {
                            beginAtZero: true,
                            display: true,
                            title:{
                                display: true,
                                text: "Valor",
                                font: {
                                    weight: 'bold',
                                }, 
                            },
                        },
                        x: {   
                            display: true,
                            title:{
                                display: true,
                                text: "Provincias de Andalucía" ,
                                font: {
                                    weight: 'bold',
                                },
                            }
                        }
                },
                layout: {
                    padding: {
                        top: 50, 
                        left: 200,
                        right: 200,
                        
                    }
                },
            }
        });
    };
    
   
</script>
<main>
    <canvas id="myChart"></canvas>
    <p>Es un uso de API Externa.</p>
</main>

