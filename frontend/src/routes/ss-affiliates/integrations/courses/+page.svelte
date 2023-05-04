<script>
    // @ts-nocheck

    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import {Alert, Row, Col, Container} from 'sveltestrap';
    import Highcharts from 'highcharts/highcharts.js';


    let API = '/api/v2/courses';
        
    if(dev)
        API = 'http://localhost:12345'+API


    onMount(async ()=> {
        let datos = await getCourses();

        console.log(datos)
    })

    async function getCourses() {

        let list = [];

        const res = await fetch(`${API}`, {
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


    

</script>
<main>

    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Cursos de formación en los últimos años</h1></Col>
        </Row>
    </Container>

</main>
<style></style>