<script>
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

        let affiliates = await getAffiliation();

        if (affiliates.length === 0 ){

            info = "La base de datos está vacía, no se pueden hacer los gráficos"

            v_info = true;

            f_info();
        }
        else{

            // @ts-ignore
            const years = affiliates.map(affiliates => affiliates.year).sort(function(a, b) {return a - b;});

            const year = years[0]
            // @ts-ignore
            const sevilla = affiliates.filter((affiliate)=> affiliate.province==='sevilla').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const huelva = affiliates.filter((affiliate)=> affiliate.province==='huelva').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const almeria = affiliates.filter((affiliate)=> affiliate.province==='almeria').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const jaen = affiliates.filter((affiliate)=> affiliate.province==='jaen').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const granada = affiliates.filter((affiliate)=> affiliate.province==='granada').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const malaga = affiliates.filter((affiliate)=> affiliate.province==='malaga').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const cordoba = affiliates.filter((affiliate)=> affiliate.province==='cordoba').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});
            // @ts-ignore
            const cadiz = affiliates.filter((affiliate)=> affiliate.province==='cadiz').map(affiliate=> affiliate.ss_affiliation).sort(function(a, b) {return a.year - b.year;});

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
    });
        

    //_____________________________Variables de ruta______________________________________
        
    let API = '/api/v2/ss-affiliates';
        
    if(dev)
        API = 'http://localhost:12345'+API

    // ____________________________Variables de datos_______________________________________


    async function getAffiliation() {

        let affiliates = [];

        const res = await fetch(API, {
            method: 'GET'
        });
        try{

            const data = await res.json();
            affiliates = data;
            
        }catch(error){

            console.log(`Error parsing result: ${error}`);
        }
        // @ts-ignore
        const status = await res.status;

        return affiliates
    }


</script>
<main>
    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Gráfica Seguridad Social en Andalucía</h1></Col>
        </Row>
    </Container>

    <br/>

    <Container>
    {#if info != ""}
        <Row><Col><Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert></Col></Row>
    {/if}
    <Row><div id="container" style="width:100%; height:400px;"></div></Row>
    </Container>
</main>
<style></style>