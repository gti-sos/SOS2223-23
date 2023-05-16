<script>

    // @ts-nocheck
    import { Row, Col, Container} from 'sveltestrap';

</script>
<main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>

    <br>
    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1>Buses y Afiliados</h1></Col>
        </Row>
    </Container>
    <br>

    <Container>
        <Row><Col><h3>Número de lineas de autobús publicas por provincia por cada 10 mil afiliados</h3></Col></Row>
        <br>
        <Row><Col><div id="chart" style="width:100%; height:400px;"></div></Col></Row>
    </Container>
    <br>
    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><p>Este gráfico es una integración, pero sí la base de datos está vacía, se convierte en un uso</p></Col>
        </Row>
    </Container>
    
    <script>

        getAffiliates();


        async function generarGrafica(list){

            let buses = await getBuses();
    
            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        ['10 miles de Afiliados', list[1], list[2], list[3], list[4], list[5], list[6], list[7], list[8]],
                        ['Buses', buses[1], buses[2], buses[3], buses[4], buses[6], buses[7], buses[8], buses[9]]
                        
                    ],
                    type: 'bar',
                    types: {
                        Buses: 'area'
                    },
                }, 
                axis: {
                    x: {
                        type: 'category',
                        categories: ['Sevilla', 'Cádiz', 'Granada', 'Málaga', 'Almería', 'Jaén', 'Córdoba', 'Huelva']
                    }
                }
            });
        }

        async function generarGrafica2(){

            let buses = await getBuses();

            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        ['Buses', buses[1], buses[2], buses[3], buses[4], buses[6], buses[7], buses[8], buses[9]]
                    ],
                    type: 'area'
                }, 
                axis: {
                    x: {
                        type: 'category',
                        categories: ['Sevilla', 'Cádiz', 'Granada', 'Málaga', 'Almería', 'Jaén', 'Córdoba', 'Huelva']
                    }
                }
            });
        }

        async function getBuses() {

            let list = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};

            for(let i = 1; i < 10; i++){
                const res = await fetch(`http://api.ctan.es/v1/Consorcios/${i}/lineas`, {
                    method: 'GET'
                });
                try{

                    const data = await res.json();
                    buses =  data.lineas || [];
                    list[i] = buses.length;
                    
                }catch(error){

                    console.log(`Error parsing result: ${error}`);
                }
            }

            return list

        }

        async function getAffiliates() {

            let currentUrl = window.location.href;

            let API = '/api/v2/ss-affiliates';

            if (currentUrl.includes('localhost')){
                API = 'http://localhost:12345'+API
            }

            let list = [];

            const res = await fetch(`${API}`, {
                method: 'GET'
            });
            try{

                const data = await res.json();
                list = getAffiliations(data);
                generarGrafica(list);
                
            }catch(error){

                generarGrafica2();
                
            }
            // @ts-ignore
            const status = await res.status;

            return list

        }

        function getAffiliations(affiliates) {

            let list = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0};

            for(let affiliate of affiliates){
                if(affiliate.year == 2022){
                    if(affiliate.province == 'sevilla'){
                        list[1] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'cadiz'){
                        list[2] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'granada'){
                        list[3] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'malaga'){
                        list[4] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'almeria'){
                        list[5] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'jaen'){
                        list[6] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'cordoba'){
                        list[7] = affiliate.ss_affiliation/10000;
                    }else if(affiliate.province == 'huelva'){
                        list[8] = affiliate.ss_affiliation/10000;
                    }
                }
               
            }

            return list

        }


    </script>


</main>
<style></style>