<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.2.2/dist/echarts.min.js"></script>
</svelte:head>
<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import * as echarts from 'echarts';

    onMount(async () =>{
        //getData();
        loadEchartPie();
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));
    let dataGoogle = [];
    const APIGoogle = 'https://google-data-scraper.p.rapidapi.com/search/shop/NVIDIA%20GeForce%20RTX%204090?api_key=5dd4daa4ca18889f01522cf2321ee30a';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '16ee2bd576msh9cc1a680fac4200p18deefjsn2b38b3ee309e',
            'X-RapidAPI-Host': 'google-data-scraper.p.rapidapi.com'
        }
    };
    async function getData() {
        const res = await fetch(APIGoogle,options, {
            method: 'GET'
        });
        try{
            const data = await res.json();
            dataGoogle = data.shopping_results.filter(n=> n.rating!=null && n.title.includes("4090")==true && 
            (n.price.charAt(0)=="$" || n.price.charAt(0)=="€"))
            .map(({title,source,extracted_price,price}) => ({title,source,extracted_price,price}))
            console.log(dataGoogle);
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }
        //await delay(500);
        //loadChart();
    };

    async function loadEchartPie(){
        var myPie = echarts.init(document.getElementById('main'));        
        myPie.setOption({
            title: {
                text: 'Precio de PlayStation 5 según cada vendedor',
                subtext: 'Resultados extraidos de google, se actualizan cada vez que refrescas la ventana',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                name: 'Precio',
                type: 'pie',
                radius: '75%',
                data: [
                    //data
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
            ]},
        )};
</script>
<main>
    <div id="main" style="width: 1300px;height:500px;margin-left:15px"></div>
</main>