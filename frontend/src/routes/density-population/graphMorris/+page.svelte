<svelte:head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
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
        const huelva = graphData.filter((n)=>{
            return n.province == "Huelva" && n.gender == "Hombres";
        }).map((n) => {
            return {
                ...n,
                year: n.year.toString()
            }
        });

        var graph =  Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'myfirstchart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: huelva,
        // The name of the data record attribute that contains x-values.
        xkey: `year`,
        // A list of names of data record attributes that contain y-values.
        ykeys: ['municipality_size_lt_ft','municipality_size_bt_ft_tht','municipality_size_gt_tht','capital_size'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Municipios pequeños','Municipios medianos','Municipios grandes','Capital'],
        
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
    <div id="myfirstchart" style="height: 250px;"></div>
</main>