<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.2.2/dist/echarts.min.js"></script>
</svelte:head>

<script>
    // @ts-nocheck
    import * as echarts from 'echarts';
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { Alert } from 'sveltestrap';

    let API = '/api/v2/density-population';    
    if(dev)
        API = 'http://localhost:12345'+API;

    let density=[];

    let mensaje = "";
    let m_bool = false;
    function f_info() {
        (setTimeout(function(){m_bool = false;}, 6000));
    }

    async function loadChartHigh(graphData){
        
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
                crosshair: true,
                
            },
            yAxis: {
                min: 0,
                max: 75,
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
                pointPadding: 0.4,
                borderWidth: 0
                }
            },
            series: [{
                name: 'Municipality size < 5,000',
                data: graphData.map(item => parseInt(item.municipality_size_lt_ft))
            }, {
                name: 'Municipality size 5,000-50,000',
                data: graphData.map(item => parseInt(item.municipality_size_bt_ft_tht))
            }, {
                name: 'Municipality size > 50,000',
                data: graphData.map(item => parseInt(item.municipality_size_gt_tht))
            }, {
                name: 'Capital size',
                data: graphData.map(item => parseInt(item.capital_size))
            }]
        });
    };

    async function getData() {
        const res = await fetch(API, {
            method: 'GET'
        });
        try{
            const dataReceived = await res.json();
            density = dataReceived;
            loadChartHigh(density);
            loadEchart(density);
            
        }catch(error){
            mensaje = "La base de datos está vacía";
            m_bool = true;
            f_info();
            console.log(`Error parseando el resultado: ${error}`);
        }	   
    };

    async function loadEchart(graphData){
        var myChart = echarts.init(document.getElementById('main'));        
        myChart.setOption({
                title: {
                    text: 'Gráfico de densidad de población por género para algunas ciudades costeras en municipios grandes',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    bottom: 35, 
                    data: ['Huelva-Hombres','Huelva-Mujeres','Cádiz-Hombres', 'Cádiz-Mujeres', 'Málaga-Hombres','Málaga-Mujeres']   
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: graphData.map(item => item.year).filter((value, index, self) => self.indexOf(value) === index)

                },
                yAxis: {
                    name:'Densidad de poblacion de municipios pequeños',
                    type: 'value',
                },
                series: [
                    {
                        name: 'Huelva-Hombres',
                        color:'#2211F8',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Huelva' && item.gender === 'Hombres').map(item =>item.municipality_size_bt_ft_tht)
                    },
                    {
                        name: 'Huelva-Mujeres',
                        color:'#C569DB',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Huelva' && item.gender === 'Mujeres').map(item =>item.municipality_size_bt_ft_tht)
                    },
                    {
                        name: 'Cádiz-Hombres',
                        color:'#FFF300',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Cádiz' && item.gender === 'Hombres').map(item =>item.municipality_size_bt_ft_tht)
                    },
                    {
                        name: 'Cádiz-Mujeres',
                        color:'#6EDB69',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Cádiz' && item.gender === 'Mujeres').map(item =>item.municipality_size_bt_ft_tht)
                    },
                    {
                        name: 'Málaga-Hombres',
                        color:'#F91212',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Málaga' && item.gender === 'Hombres').map(item =>item.municipality_size_bt_ft_tht)
                    },
                    {
                        name: 'Málaga-Mujeres',
                        color:'#FA9696',
                        type: 'line',
                        data: graphData.filter(item => item.province === 'Málaga' && item.gender === 'Mujeres').map(item =>item.municipality_size_bt_ft_tht)
                    }
                ]
            });
        
    };
    onMount(async () =>{
        getData();
    });
</script>
<main>
    <Alert color="info" isOpen={m_bool} toggle={() => (m_bool = false)}>{mensaje}</Alert>
    <div id="container"></div>
    <div id="main" style="width: 1300px;height:400px;margin-left:15px"></div>
</main>