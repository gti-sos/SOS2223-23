<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import {Alert, Row, Col, Container} from 'sveltestrap';
    import Highcharts from 'highcharts/highcharts.js';


    let API = '/api/v2/job-offers';
        
    if(dev)
        API = 'http://localhost:12345'+API


    onMount(async ()=> {

        let datos = await procesarDatos();

        Highcharts.chart('container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (8 más significativos)'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datos[0].name,
                    y: datos[0].number
                }, {
                    name: datos[1].name,
                    y: datos[1].number
                }, {
                    name: datos[2].name,
                    y: datos[2].number
                }, {
                    name: datos[3].name,
                    y: datos[3].number
                }, {
                    name: datos[4].name,
                    y: datos[4].number
                }, {
                    name: datos[5].name,
                    y: datos[5].number
                }, {
                    name: datos[6].name,
                    y: datos[6].number
                }, {
                    name: datos[7].name,
                    y: datos[7].number
                }, {
                    name: datos[8].name,
                    y: datos[8].number
                }]
            }]
    });
    })


    async function getJobsSevilla() {

        let list = [];

        const res = await fetch(`${API}/sevilla`, {
            method: 'GET'
        });
        try{

            const data = await res.json();
            list = data;
            
        }catch(error){

            console.log(`Error parsing result: ${error}`);
        }
        // @ts-ignore
        const status = await res.status;

        return list

    }

    async function procesarDatos(){

        let datosSevilla = await getJobsSevilla();

        let ofertas = datosSevilla.results;

        let total = datosSevilla.total_hits;

        const jobNames = []

        let jobNumbers = []

        const structure = []

        for (let i = 0; i<total;  i++){

            if (jobNames.includes(ofertas[i].job_name)){

                let index = jobNames.indexOf(ofertas[i].job_name)

                jobNumbers[index] += parseInt(ofertas[i].job_number_places);

            }else{

                jobNames.push(ofertas[i].job_name);
                jobNumbers.push(parseInt(ofertas[i].job_number_places));
            }
        }

        for(let i = 0; i<jobNames.length;  i++){
            structure.push({name:jobNames[i], number: jobNumbers[i]})
        }

        let datos = structure.sort((a,b)=>{
            return b.number - a.number;
        })

        return datos;
    }
    

</script>
<main>
    <Container>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Andalucía</h3></Col></Row>
        <Row><Col><div id="container" style="width:100%; height:400px;"></div></Col></Row>
    </Container>
</main>
<style></style>