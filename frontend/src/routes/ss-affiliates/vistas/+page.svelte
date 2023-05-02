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

        const affiliation = await getAffiliation();

        // @ts-ignore
        const sevilla2 = affiliation.filter((affiliate) => affiliate.province==='sevilla').sort(function(a, b) {return a.year - b.year;}).map((affiliate)=> {return {ss_affiliation: affiliate.ss_affiliation, n_cont_indef:affiliate.n_cont_indef, n_cont_eventual: affiliate.n_cont_eventual, n_cont_temporary:affiliate.n_cont_temporary }})
        
        let sevilla_affiliation = ['data1']

        // @ts-ignore
        sevilla_affiliation = sevilla_affiliation.concat(sevilla2.map(affiliate => affiliate.ss_affiliation))

        const data = sevilla_affiliation

        let sevilla_eventual = ['data2']

        // @ts-ignore
        sevilla_eventual = sevilla_eventual.concat(sevilla2.map(affiliate => affiliate.n_cont_eventual))

        const data2 = sevilla_eventual

        let sevilla_temporary = ['data3']

        // @ts-ignore
        sevilla_temporary = sevilla_temporary.concat(sevilla2.map(affiliate => affiliate.n_cont_temporary))

        const data3 = sevilla_temporary

        console.log(sevilla_affiliation)
        console.log(sevilla_eventual)
        console.log(sevilla_temporary)

        if (affiliation.length === 0 ){

            info = "La base de datos está vacía, no se pueden hacer los gráficos"

            v_info = true;

            f_info();
        }
        else{

            console.log(affiliation)

            chart1();
           

            
        }
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

    async function chart1(){

        let affiliates = await getAffiliation();
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
</script>
<main>
    <link href="../../node_modules/c3/c3.css" rel="stylesheet">

    <script src="../../node_modules/d3/dist/d3.min.js" charset="utf-8"></script>
    <script src="../../node_modules/c3/c3.min.js"></script>


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
        <Row><div id="container2"></div></Row>
    </Container>

    <script>

        var chart = c3.generate({
            bindto: document.getElementById('container2'),
            data: {
                columns: [
                    ['data1', 609250, 602963, 617140, 626250, 641183, 662450, 683295, 696221, 689844, 714337, 729400],
                    ['data2', 175997, 180755, 184601, 184162, 189533, 199026, 198047, 199047, 179297, 181757, 75484]
                ]
            },axes: {
                data2: 'y2'
            },
            types: {
                data2: 'bar' 
            },
            axis: {
                y: {
                    label: {
                        text: 'Y Label',
                        position: 'outer-middle'
                    }
                },
                y2: {
                    show: true,
                    label: {
                        text: 'Y2 Label',
                        position: 'outer-middle'
                    }
                }
            }
        });
    </script>
</main>
<style></style>