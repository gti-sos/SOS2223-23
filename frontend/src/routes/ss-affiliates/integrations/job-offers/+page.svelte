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

        let sevilla = await getJobs('sevilla')

        let datosSevilla = procesarDatos(sevilla);

        Highcharts.chart('containerSev', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (8 más significativos) en Sevilla'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosSevilla[0].name,
                    y: datosSevilla[0].number
                }, {
                    name: datosSevilla[1].name,
                    y: datosSevilla[1].number
                }, {
                    name: datosSevilla[2].name,
                    y: datosSevilla[2].number
                }, {
                    name: datosSevilla[3].name,
                    y: datosSevilla[3].number
                }, {
                    name: datosSevilla[4].name,
                    y: datosSevilla[4].number
                }, {
                    name: datosSevilla[5].name,
                    y: datosSevilla[5].number
                }, {
                    name: datosSevilla[6].name,
                    y: datosSevilla[6].number
                }, {
                    name: datosSevilla[7].name,
                    y: datosSevilla[7].number
                }, {
                    name: datosSevilla[8].name,
                    y: datosSevilla[8].number
                }]
            }]
        });

        let huelva = await getJobs('huelva')

        let datosHuelva = procesarDatos(huelva);

        Highcharts.chart('containerHue', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (todos) en Huelva'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosHuelva[0].name,
                    y: datosHuelva[0].number
                }, {
                    name: datosHuelva[1].name,
                    y: datosHuelva[1].number
                }, {
                    name: datosHuelva[2].name,
                    y: datosHuelva[2].number
                }, {
                    name: datosHuelva[3].name,
                    y: datosHuelva[3].number
                }, {
                    name: datosHuelva[4].name,
                    y: datosHuelva[4].number
                }]
            }]
        });

        let cadiz = await getJobs('cadiz')

        let datosCadiz = procesarDatos(cadiz);

        console.log(datosCadiz)
    

        Highcharts.chart('containerCad', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (todos) en Cadiz'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosCadiz[0].name,
                    y: datosCadiz[0].number
                }, {
                    name: datosCadiz[1].name,
                    y: datosCadiz[1].number
                }, {
                    name: datosCadiz[2].name,
                    y: datosCadiz[2].number
                }, {
                    name: datosCadiz[3].name,
                    y: datosCadiz[3].number
                }, {
                    name: datosCadiz[4].name,
                    y: datosCadiz[4].number
                }]
            }]
        });
        let almeria = await getJobs('almeria')

        let datosAlmeria = procesarDatos(almeria);

        Highcharts.chart('containerAlm', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (todos) en Almeria'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosAlmeria[0].name,
                    y: datosAlmeria[0].number
                }, {
                    name: datosAlmeria[1].name,
                    y: datosAlmeria[1].number
                }, {
                    name: datosAlmeria[2].name,
                    y: datosAlmeria[2].number
                }, {
                    name: datosAlmeria[3].name,
                    y: datosAlmeria[3].number
                }, {
                    name: datosAlmeria[4].name,
                    y: datosAlmeria[4].number
                }]
            }]
        });
        let granada = await getJobs('granada')

        let datosGranada = procesarDatos(granada);
        

        Highcharts.chart('containerGra', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Cantidad de plazas ofertadas por trabajo (todos) en Granada'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosGranada[0].name,
                    y: datosGranada[0].number
                }, {
                    name: datosGranada[1].name,
                    y: datosGranada[1].number
                }, {
                    name: datosGranada[2].name,
                    y: datosGranada[2].number
                }, {
                    name: datosGranada[3].name,
                    y: datosGranada[3].number
                }, {
                    name: datosGranada[4].name,
                    y: datosGranada[4].number
                }]
            }]
        });
    })


    async function getJobs(province) {

        let list = [];

        const res = await fetch(`${API}/${province}`, {
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

    function procesarDatos(data){

        let ofertas = data.results;

        let total = data.total_hits;

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
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Gráficas ofertas de trabajo públicas en Andalucía</h1></Col>
        </Row>
    </Container>

    <Container>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Sevilla</h3></Col></Row>
        <Row><Col><div id="containerSev" style="width:100%; height:400px;"></div></Col></Row>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Huelva</h3></Col></Row>
        <Row><Col><div id="containerHue" style="width:100%; height:400px;"></div></Col></Row>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Granada</h3></Col></Row>
        <Row><Col><div id="containerGra" style="width:100%; height:400px;"></div></Col></Row>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Cadiz</h3></Col></Row>
        <Row><Col><div id="containerCad" style="width:100%; height:400px;"></div></Col></Row>
        <Row><Col><h3> Ofertas de trabajo en los últimos años Almeria</h3></Col></Row>
        <Row><Col><div id="containerAlm" style="width:100%; height:400px;"></div></Col></Row>
    </Container>
</main>
<style></style>