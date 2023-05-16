<script>

    // @ts-nocheck
    
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import Highcharts from 'highcharts/highcharts.js';
    import {Alert, Row, Col, Container} from 'sveltestrap';

    

    let info = "";
    let v_info = false;
    function f_info() {
        (setTimeout(function(){v_info = false;}, 6000));
    }


    onMount(async () => {
        chart();
    });
        

    //_____________________________Variables de ruta______________________________________
        
    let API = '/api/v2/ss-affiliates';
        
    if(dev)
        API = 'http://localhost:12345'+API

    // ____________________________Variables de datos_______________________________________


    async function getAffiliation() {

        let list = [];

        const res = await fetch(API, {
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

    async function chart(){

        let affiliates = await getAffiliation();

        if (affiliates.length === 0 ){

            info = "La base de datos está vacía, no se pueden hacer los gráficos"

            v_info = true;

            f_info();

        }else{
            // @ts-ignore
            const years = affiliates.map(affiliate => affiliate.year).sort(function(a, b) {return a - b;});

            const year = years[0]
            // @ts-ignore
            const sevilla = affiliates.filter((affiliate)=> affiliate.province==='sevilla').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const huelva = affiliates.filter((affiliate)=> affiliate.province==='huelva').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const almeria = affiliates.filter((affiliate)=> affiliate.province==='almeria').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const jaen = affiliates.filter((affiliate)=> affiliate.province==='jaen').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const granada = affiliates.filter((affiliate)=> affiliate.province==='granada').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const malaga = affiliates.filter((affiliate)=> affiliate.province==='malaga').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const cordoba = affiliates.filter((affiliate)=> affiliate.province==='cordoba').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);
            // @ts-ignore
            const cadiz = affiliates.filter((affiliate)=> affiliate.province==='cadiz').sort(function(a, b) {return a.year - b.year;}).map(affiliate=> affiliate.ss_affiliation);

            // @ts-ignore
            const chart = Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                title: {
                    text: 'Afiliados en Andalucia',
                    align: 'left'
                },
                yAxis: {
                    title: {
                        useHTML: true,
                        text: 'Afiliados a la seguridad social'
                    }
                },
                tooltip: {
                    shared: true,
                    headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
                },
                plotOptions: {
                    series: {
                        pointStart: year
                    },
                    area: {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#666666'
                        }
                    }
                },
                series: [{
                    name: 'Sevilla',
                    data: sevilla
                }, {
                    name: 'Huelva',
                    data: huelva

                }, {
                    name: 'Almeria',
                    data: almeria
                }, {
                    name: 'Jaen',
                    data: jaen

                }, {
                    name: 'Granada',
                    data: granada
                },{
                    name: 'Malaga',
                    data: malaga
                },{
                    name: 'Cadiz',
                    data: cadiz
                },{
                    name: 'Cordoba',
                    data: cordoba
                }]
            });   
        }
        
    }

    
</script>
<main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>


    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Gráficas Seguridad Social en Andalucía</h1></Col>
        </Row>
    </Container>

    <br/>

    <Container>
    {#if info != ""}
        <Row><Col><Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert></Col></Row>
    {/if}
        <Row><Col><h3> Gráfica Afiliados en Andalucía</h3></Col></Row>
        <Row><Col><div id="container" style="width:100%; height:400px;"></div></Col></Row>
        <br/>
        <Row><Col><h3> Gráfica Nuevos contratos Sevilla</h3></Col></Row>
        <Row><Col><div id="chart" style="width:100%; height:400px;"></div></Col></Row>
    </Container>

    <script>

        generarGrafica();

        async function getAffiliation() {

            let currentUrl = window.location.href;
        

            let API = '/api/v2/ss-affiliates';

            if (currentUrl.includes('localhost')){
                API = 'http://localhost:12345'+API
            }

            let list = [];

            const res = await fetch(API, {
                method: 'GET'
            });
            try{

                const data = await res.json();
                list = data;
                
            }catch(error){

                console.log(`Error parsing result: ${error}`);
            }

            return list
        } 

        async function generarGrafica(){

            const data = await getAffiliation()

            if (data.length !== 0 ){
                 // @ts-ignore
                const sevilla = data.filter((affiliate) => affiliate.province==='sevilla').sort(function(a, b) {return a.year - b.year;}).map((affiliate)=> {return {year: affiliate.year, ss_affiliation: affiliate.ss_affiliation, n_cont_indef:affiliate.n_cont_indef, n_cont_eventual: affiliate.n_cont_eventual, n_cont_temporary:affiliate.n_cont_temporary }})
                
                let sevilla_year = ['date']

                // @ts-ignore
                sevilla_year = sevilla_year.concat(sevilla.map(affiliate => affiliate.year.toString()))

                const x_axis = sevilla_year

                let sevilla_affiliation = ['afiliados']

                // @ts-ignore
                sevilla_affiliation = sevilla_affiliation.concat(sevilla.map(affiliate => affiliate.ss_affiliation))

                const data1 = sevilla_affiliation

                let sevilla_eventual = ['eventuales']

                // @ts-ignore
                sevilla_eventual = sevilla_eventual.concat(sevilla.map(affiliate => affiliate.n_cont_eventual))

                const data2 = sevilla_eventual

                let sevilla_temporary = ['temporales']

                // @ts-ignore
                sevilla_temporary = sevilla_temporary.concat(sevilla.map(affiliate => affiliate.n_cont_temporary))

                const data3 = sevilla_temporary

                let sevilla_indef = ['indefinidos']

                // @ts-ignore
                sevilla_indef = sevilla_indef.concat(sevilla.map(affiliate => affiliate.n_cont_indef))

                const data4 = sevilla_indef 

                var chart = c3.generate({
                    bindto: '#chart',
                    data: {
                        x : 'date',
                        xFormat: '%Y', 
                        columns: [
                            x_axis,
                            data1,
                            data2,
                            data3, 
                            data4
                        ],
                        type: 'bar',
                        types: {
                            'afiliados': 'line'
                        },
                        groups: [
                            ['eventuales', 'temporales', 'indefinidos']
                        ]
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%Y'
                            }
                        },
                        y: {
                            label: {
                                text: 'Número de afiliados',
                                position: 'outer-middle'
                            }
                        },
                        y2: {
                            show: true,
                            label: {
                                text: 'Número de contratos',
                                position: 'outer-middle'
                            }
                        }
                    }
                });
            }
        }

        

    </script>
</main>
<style></style>