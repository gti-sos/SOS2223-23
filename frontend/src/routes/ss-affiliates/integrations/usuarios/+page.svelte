<script>
    // @ts-nocheck

    import { Row, Col, Container, Card, CardHeader, CardTitle, CardText, CardBody} from 'sveltestrap';
    import { onMount } from 'svelte';

    onMount(async () => {

        await getUsers();

        console.log(datos);

    });
    let datos = [];

    

    async function getUsers(){
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => datos = json);
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

</script>
<main>

        <!--______________________________________Cabecera_____________________________________-->
        <Container>
            <Row>
                <Col sm={{ size: 'auto', offset: 2 }}><h1> Pokemons </h1></Col>
            </Row>
        </Container>
    
        <br/>

        <Container>
            <Row cols={{ xs:2,sm: 3, md: 3, lg: 3, xl:4}}>
            {#each datos as usuario}
                <Col class = 'mb-3'>
                    <Card>
                        <CardHeader>
                        <CardTitle><b>{capitalizeFirstLetter(usuario.name)}</b></CardTitle>
                        </CardHeader>
                        <CardBody>
                            <CardText>
                                <b>Email:</b> {usuario.email} <br>
                                <b>Teléfono:</b> {usuario.phone} <br>
                                <b>Usuario:</b> {usuario.username} <br>
                                <b>Pagina Web:</b> {usuario.website} <br>
                                <b>Direccion:</b> {usuario.address.city} / {usuario.address.street} / {usuario.address.suite} <br>
                                <b>Trabajando Para:</b> {usuario.company.name} <br>
                            </CardText>
                            </CardBody>
                    </Card>
                </Col>
            {/each}
        </Row>
        </Container>
</main>
<style></style>