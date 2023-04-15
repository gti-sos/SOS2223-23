<script>
    // @ts-nocheck
    
    // ___________________________Imports________________________________________________

        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, 
            Icon,
            FormGroup,
            Label,
            Input,
            Modal,
            ModalBody,
            ModalFooter,
            ModalHeader,
            Alert, 
            Card,
            CardBody,
            CardHeader,
            CardText,
            CardTitle, 
            Row, 
            Col, 
            Container} from 'sveltestrap';

    //____________________________Inicialización__________________________________________
        onMount(async () => {

        
            getAffiliation('');

            

        });
    
    //_____________________________Variables de ruta______________________________________
        
        let API = '/api/v2/ss-affiliates';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
    // ____________________________Variables de datos_______________________________________

        let affiliates = []; //Datos
        let total = 0;
        let pagina = 0;
        const itemsPerPage = 10;
        let lastPage = 0;
        let v_lastPage = true;
        function nextPage() {
            if (!v_lastPage) {
                pagina++;
                getAffiliation('');
            }
        }
  
        function previousPage() {
            if (pagina > 1) {
                pagina--;
                getAffiliation('');
            }
        }

        //Para crear datos
        let newYear = ''; 
        let newProvince = '';
        let newSs_affiliation = '';
        let newN_cont_indef = '';
        let newN_cont_eventual = '';
        let newN_cont_temporary = '';

    // ______________________________Variables de control_____________________________________
        //Avisos
        let warning = "";
        let v_warning = false;
        function f_warning() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
    
        //Info
        let info = "";
        let v_info = false;
        let info2 = "";
        let v_info2 = false;
        function f_info() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        function f_info2() {
            (setTimeout(function(){v_info = false;}, 6000));
        }

        //Errores
        let errores = "";
        let v_errores = false;

        //Borrado
        let v_borrar = false;
        const borrar = () => (v_borrar = !v_borrar);
        
        //Para crear
        let v_crear = false;
        const crear = () => (v_crear = !v_crear);

        //Para buscar 
        let v_buscar = false;
        const buscar = () => (v_buscar = !v_buscar);
        let busqueda = '';


        //Para depuracion
        let result = "";
        let resultStatus = "";
    

        //Cargar datos de la base si vacia
        async function loadData() {
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status==201){

                getAffiliation(''); 

                info = "La base de datos se ha cargado correctamente"

                v_info = true;

                f_info();

            }else if(status==200){

                info = "La base de datos ya está cargada, si quiere cargar los datos iniciales, borre los datos existentes";

                v_info = true;

                f_info();

            }else if(status == 500){

                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                v_error = true;
            }
        }

        async function getCount(query){
            resultStatus = result = "";
            const res = await fetch(API+`/count${query}`, {
                method: 'GET'
            });
            try{
                const count = await res.json();
                total = count;
                lastPage = Math.floor(total/itemsPerPage);
                v_lastPage = (pagina == lastPage)
                if(count==0){

                    warning = "No hay datos cargados en la base de datos";

                    v_warning = true;

                    f_warning();
}
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            
        }
        //Obtener datos
        async function getAffiliation(query) {
            let newquery = '';

            if (query != ''){

                newquery = '?'+query.slice(1);

            }
            
            await getCount(newquery);
            if (total != 0){
                resultStatus = result = "";
                const res = await fetch(API+`?offset=${pagina*itemsPerPage}&limit=${itemsPerPage}${query}`, {
                    method: 'GET'
                });
                try{

                    const data = await res.json();
                    result = JSON.stringify(data,null,2);
                    affiliates = data;
                    
                }catch(error){

                    console.log(`Error parsing result: ${error}`);
                }
                const status = await res.status;
                resultStatus = status;	
                if(status==404){

                    warning = "No hay datos cargados en la base de datos o ya no hay más datos";

                    v_warning = true;

                    f_warning();

                }else if(status==200){

                    info = `Mostrando la pagina ${pagina} de la base de datos`

                    v_info = true;

                    f_info();

                }else if(status == 500){

                    error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                    v_error = true;

                }
            }
            
        }
      
        async function createAffiliation() {
            resultStatus = result = "";
            if(newSs_affiliation=="" || newN_cont_indef==""|| newN_cont_eventual==""||  newN_cont_temporary==""){
                warning = "No se puede actualizar si el dato no se pasa completo";
                v_warning = true;
            }else{
                const res = await fetch(API, {
                    method: 'POST',
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body:JSON.stringify({
                        year: newYear,
                        province: newProvince,
                        ss_affiliation: newSs_affiliation,
                        n_cont_indef: newN_cont_indef,
                        n_cont_eventual: newN_cont_eventual,
                        n_cont_temporary: newN_cont_temporary
                    })
                });
                const status = await res.status;
                resultStatus = status;	           
                if(status==201){

                    getAffiliation('');

                    info2 = `El dato ${newProvince} ${newYear} se ha creado correctamente`;

                    v_info2 = true;

                    f_info2();

                }else if(status==409){

                    warning = `El dato con identificador ${province} ${year} ya existe en la base de datos`;

                    v_warning = true;

                    f_warning();

                }else if(status==400){

                    warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo`;
                    
                    v_warning = true;

                    f_warning();

                }else if(status == 500){

                    error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                    v_error = true;

                }
            }
        }

        async function deleteAffiliation(affiliate) {

            resultStatus = result = "";

            const res = await fetch(API+"/"+affiliate, {
                method: 'DELETE'
            });

            const status = await res.status;

            resultStatus = status;	

            if(status==204){

                getAffiliation(''); 

                info2 = `Se ha borrado correctamente el dato ${affiliate}`;

                v_info2 = true;

                f_info2();

            }else if(status == 400){

                info = `El dato ${affiliate} no existe en la base de datos`;

                v_info = true;

                f_info();

            }else if(status == 500){

                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                v_error = true;

            }
        }


        async function deleteAllData() {
            resultStatus = result = "";
            try {
                const res = await fetch(API, {
                method: 'DELETE',
                });
                const status = await res.status;
                if (status === 204) {

                    info2 = "Todos los datos han sido borrados";

                    v_info2 = true;

                    f_info2();

                    getAffiliation('');

                    resultStatus = "Todos los datos han sido borrados";

                    console.log('Todos los datos han sido borrados.');
                }
            } catch (error) {

                errores = error

                v_errores = true;

                resultStatus = "Error borrando todos los datos.";

                console.error(`Error borrando todos los datos: ${error}`);
            }
        }

        function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
</script>
<main>

    <!--______________________________________Cabecera_____________________________________-->
    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Datos de la Seguridad Social en Andalucía</h1></Col>
        </Row>
    </Container>

    <br/>

    <!--______________________________________Alertas y avisos_____________________________________-->
    <Container>
        
        {#if errores != ""}
        <Row><Col><Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert></Col></Row>
        {/if}
        {#if warning != ""}
        <Row><Col><Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert></Col></Row>
        {/if}
        {#if info2 != ""}
        <Row><Col><Alert color="info" isOpen={v_info2} toggle={() => (v_info2 = false)}>{info2}</Alert></Col></Row>
        {/if}
        {#if info != ""}
        <Row><Col><Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert></Col></Row>
        {/if}
    </Container>

    <!--_______________________________________________Botonera______________________________________________-->
    <Container class = 'mb-3'>
        <Row>
            <Col>
                <Button on:click={loadData}>Cargar Datos<Icon name="collection"></Icon></Button>
            </Col>
            <Col>
                <Button on:click={borrar}>Borrar Datos</Button>
                <Modal isOpen={v_borrar} {borrar}>
                    <ModalHeader {borrar}>Eliminar Datos</ModalHeader>
                    <ModalBody>
                        ¿Estás seguro que quieres eliminar todos los datos?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" on:click={() => { deleteAllData(); borrar(); location.reload();}}>Eliminar</Button>
                        <Button color="secondary" on:click={borrar}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </Col>
            <Col>
                <Button on:click={() => {crear(); v_buscar = false;}}>Introducir Dato</Button>
            </Col>
            <Col>
                <Button on:click={() => {buscar(); v_crear = false}}>Buscar Datos</Button>
            </Col>
        </Row>
    </Container >

    <!--______________________________________Formulario para creacion de nuevos recursos_____________________________________-->
    {#if v_crear}
        <Container class = 'mb-3'>
            <Row>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="province">Provincia nuevo dato</Label>
                        <Input
                            type="text"
                            id = "province"
                            name="province"
                            placeholder="Escribe una provincia"
                            bind:value={newProvince}
                        />
                    </FormGroup></Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="year">Año nuevo dato</Label>
                        <Input
                            type="number"
                            id = "year"
                            name="year"
                            placeholder="Escribe un año"
                            bind:value={newYear}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="affiliate">Afiliados nuevo dato</Label>
                        <Input
                            type="number"
                            id = "affiliate"
                            name="affiliate"
                            placeholder="Escribe una cifra"
                            bind:value={newSs_affiliation}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="indef">Indefinidos nuevo dato</Label>
                        <Input
                            type="number"
                            id = "indef"
                            name="indef"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_indef}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="event">Eventuales nuevo dato</Label>
                        <Input
                            type="number"
                            id = "event"
                            name="event"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_eventual}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="temp">Temporales nuevo dato</Label>
                        <Input
                            type="number"
                            id = "temp"
                            name="temp"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_temporary}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={createAffiliation}>Crear</Button></Col>
                <Col></Col>
            </Row>
        </Container>
    {/if}


    <!--______________________________________Cuadro de búsquedas_____________________________________________-->
    {#if v_buscar}
        <Container class = 'mb-3'>
            <Row>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="province">Provincia nuevo dato</Label>
                        <Input
                            type="text"
                            id = "province"
                            name="province"
                            placeholder="Escribe una provincia"
                            bind:value={newProvince}
                        />
                    </FormGroup></Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="year">Año nuevo dato</Label>
                        <Input
                            type="number"
                            id = "year"
                            name="year"
                            placeholder="Escribe un año"
                            bind:value={newYear}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="affiliate">Afiliados nuevo dato</Label>
                        <Input
                            type="number"
                            id = "affiliate"
                            name="affiliate"
                            placeholder="Escribe una cifra"
                            bind:value={newSs_affiliation}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="indef">Indefinidos nuevo dato</Label>
                        <Input
                            type="number"
                            id = "indef"
                            name="indef"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_indef}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="event">Eventuales nuevo dato</Label>
                        <Input
                            type="number"
                            id = "event"
                            name="event"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_eventual}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="temp">Temporales nuevo dato</Label>
                        <Input
                            type="number"
                            id = "temp"
                            name="temp"
                            placeholder="Escribe una cifra"
                            bind:value={newN_cont_temporary}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={()=>{getAffiliation(busqueda)}}>Buscar</Button></Col>
                <Col></Col>
            </Row>
        </Container>
    {/if}
    

    <hr/>
                
    <!--_______________________________________________Datos_________________________________________________-->
    <Container>
        <Row cols={{ xs:2,sm: 3, md: 3, lg: 3, xl:4}}>
        {#each affiliates as affiliate}
            <Col class = 'mb-3'>
                <Card>
                    <CardHeader>
                    <CardTitle>{capitalizeFirstLetter(affiliate.province)} {affiliate.year}</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <CardText>
                        Afiliados a la seguridad Social: {affiliate.ss_affiliation} <br>
                        Nuevos contratos indefinidos: {affiliate.n_cont_indef} <br>
                        Nuevos contratos eventuales: {affiliate.n_cont_eventual} <br>
                        Nuevos contratos temporales: {affiliate.n_cont_temporary} <br>
                        <Button><a href='ss-affiliates/{affiliate.province}/{affiliate.year}'>Editar</a></Button>
                        <Button on:click={deleteAffiliation(`${affiliate.province}/${affiliate.year}`)}>Borrar</Button>
                    </CardText>
                    </CardBody>
                </Card>
            </Col>
        {/each}
    </Row>
    </Container>


    <!--______________________________________Paginación_____________________________________-->
    <Button on:click={previousPage} disabled={pagina === 0}>Previous</Button>

    <Button on:click={nextPage} disabled={v_lastPage === true}>Next</Button>

</main>

<style>

    a{
        text-decoration: none;
        color: white;
    }
    main{

        color: #002366;
        font-family: 'Times New Roman', Arial, sans-serif;
    }
    hr{
        background-color: #002366;
        height: 5px;
        margin-left: 15%;
        margin-right: 15%;
    }
</style>