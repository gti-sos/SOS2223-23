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
                text: `Sevilla en total: ${sevilla.total_hits}`
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
                text: `Huelva en total: ${huelva.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
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

        Highcharts.chart('containerCad', {
            chart: {
                type: 'pie'
            },
            title: {
                text: `Cadiz en total: ${cadiz.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosCadiz[2].name,
                    y: datosCadiz[2].number
                }, {
                    name: datosCadiz[3].name,
                    y: datosCadiz[3].number
                }, {
                    name: datosCadiz[4].name,
                    y: datosCadiz[4].number
                }, {
                    name: datosCadiz[5].name,
                    y: datosCadiz[5].number
                }, {
                    name: datosCadiz[6].name,
                    y: datosCadiz[6].number
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
                text: `Almeria en total: ${almeria.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosAlmeria[2].name,
                    y: datosAlmeria[2].number
                }, {
                    name: datosAlmeria[3].name,
                    y: datosAlmeria[3].number
                }, {
                    name: datosAlmeria[4].name,
                    y: datosAlmeria[4].number
                }, {
                    name: datosAlmeria[5].name,
                    y: datosAlmeria[5].number
                }, {
                    name: datosAlmeria[6].name,
                    y: datosAlmeria[6].number
                }, {
                    name: datosAlmeria[7].name,
                    y: datosAlmeria[7].number
                }, {
                    name: datosAlmeria[8].name,
                    y: datosAlmeria[8].number
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
                text: `Granada en total: ${granada.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosGranada[2].name,
                    y: datosGranada[2].number
                }, {
                    name: datosGranada[3].name,
                    y: datosGranada[3].number
                }, {
                    name: datosGranada[4].name,
                    y: datosGranada[4].number
                }, {
                    name: datosGranada[5].name,
                    y: datosGranada[5].number
                }, {
                    name: datosGranada[6].name,
                    y: datosGranada[6].number
                }, {
                    name: datosGranada[7].name,
                    y: datosGranada[7].number
                }, {
                    name: datosGranada[8].name,
                    y: datosGranada[8].number
                }, {
                    name: datosGranada[9].name,
                    y: datosGranada[9].number
                }, {
                    name: datosGranada[10].name,
                    y: datosGranada[10].number
                }]
            }]
        });

        let jaen = await getJobs('jaen')

        let datosJaen = procesarDatos(jaen);

        Highcharts.chart('containerJa', {
            chart: {
                type: 'pie'
            },
            title: {
                text: `Jaen en total: ${jaen.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosJaen[2].name,
                    y: datosJaen[2].number
                }, {
                    name: datosJaen[3].name,
                    y: datosJaen[3].number
                }, {
                    name: datosJaen[4].name,
                    y: datosJaen[4].number
                }, {
                    name: datosJaen[5].name,
                    y: datosJaen[5].number
                }, {
                    name: datosJaen[6].name,
                    y: datosJaen[6].number
                }]
            }]
        });

        let cordoba = await getJobs('cordoba')

        let datosCordoba = procesarDatos(cordoba);  

        Highcharts.chart('containerCor', {
            chart: {
                type: 'pie'
            },
            title: {
                text: `Cordoba en total: ${cordoba.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosCordoba[2].name,
                    y: datosCordoba[2].number
                }, {
                    name: datosCordoba[3].name,
                    y: datosCordoba[3].number
                }, {
                    name: datosCordoba[4].name,
                    y: datosCordoba[4].number
                }, {
                    name: datosCordoba[5].name,
                    y: datosCordoba[5].number
                }]
            }]
        });

        let malaga = await getJobs('malaga')

        let datosMalaga = procesarDatos(malaga);

        Highcharts.chart('containerMal', {
            chart: {
                type: 'pie'
            },
            title: {
                text: `Malaga en total: ${malaga.total_hits}`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'Job number places',
                data: [{
                    name: datosMalaga[2].name,
                    y: datosMalaga[2].number
                }, {
                    name: datosMalaga[3].name,
                    y: datosMalaga[3].number
                }, {
                    name: datosMalaga[4].name,
                    y: datosMalaga[4].number
                }, {
                    name: datosMalaga[5].name,
                    y: datosMalaga[5].number
                }, {
                    name: datosMalaga[6].name,
                    y: datosMalaga[6].number
                }, {
                    name: datosMalaga[7].name,
                    y: datosMalaga[7].number
                }, {
                    name: datosMalaga[8].name,
                    y: datosMalaga[8].number
                }, {
                    name: datosMalaga[9].name,
                    y: datosMalaga[9].number
                }, {
                    name: datosMalaga[10].name,
                    y: datosMalaga[10].number
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
        <Row cols={{ xs:1,sm: 1, md: 2, lg: 2, xl:2}}>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerSev" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerHue" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerGra" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerCad" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerAlm" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerJa" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerCor" style="width:100%; height:400px;"></div></Row>
            </Col>
            <Col class = 'mb-3'>
                <Row><h3> Ofertas de trabajo en los últimos años</h3></Row>
                <Row><div id="containerMal" style="width:100%; height:400px;"></div></Row>
            </Col>
        </Row>
    </Container>
</main>
<style></style>