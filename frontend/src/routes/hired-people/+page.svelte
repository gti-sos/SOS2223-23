<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Icon, FormGroup, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader, 
            Alert, Card, CardBody, CardHeader, CardText, CardTitle,  Row, Col, 
            Container, ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'sveltestrap';
        import { query_selector_all } from 'svelte/internal';

        onMount(async () => {
            getHired('');
        });
        
        let API = '/api/v2/hired-people';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let hireds = [];

        let total = 0;
        let pagina = 0;
        const itemsPerPage = 10;
        let lastPage = 0;
        let v_lastPage = true;
        function nextPage() {
            if (!v_lastPage) {
                pagina++;
                getHired(busqueda);
            }
        }
  
        function previousPage() {
            if (pagina >= 1) {
                pagina--;
                getHired(busqueda);
            }
        }

        let newYear = '';
        let newProvince = '';
        let newGender = '';
        let newIndefinite_contract = '';
        let newSingle_construction_contract = '';
        let newMultiple_construction_contract = '';
        let newSingle_eventual_contract = '';
        let newMultiple_eventual_contract = '';

        let searchYear = '';
        let searchProvince = '';
        let searchGender = '';
        let searchIndefinite_contract_under = '';
        let searchSingle_construction_contract_under = '';
        let searchMultiple_construction_contract_under = '';
        let searchSingle_eventual_contract_under = '';
        let searchMultiple_eventual_contract_under = '';
        let searchFrom = '';
        let searchTo = '';
        let specificYear = '';
        let specificProvince = '';
        let specificGender = '';

        function vaciarquery(){
            let searchYear = '';
            let searchProvince = '';
            let searchGender = '';
            let searchIndefinite_contract = '';
            let searchSingle_construction_contract = '';
            let searchMultiple_construction_contract = '';
            let searchSingle_eventual_contract = '';
            let searchMultiple_eventual_contract = '';
            let searchFrom = '';
            let searchTo = '';
            let specificYear = '';
            let specificProvince = '';
            let specificGender = '';
        }

        let info = "";
        let v_info = false;
        let info2 = "";
        let v_info2 = false;

        let warning = "";
        let v_warning = false;

        let errores = "";
        let v_errores = false;

        let v_borrar = false;
        let v_crear = false;

        let v_buscar1 = false;
        let v_buscar2 = false;
        let busqueda = '';

        function f_warning() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        function f_info() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        function f_info2() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        const borrar = () => (v_borrar = !v_borrar);
        const crear = () => (v_crear = !v_crear);
        const buscar1 = () => (v_buscar1 = !v_buscar1);
        const buscar2 = () => (v_buscar2 = !v_buscar2);
    
        let result = "";
        let resultStatus = "";

        function realizarBusqueda(){
            busqueda = '&'
            if(searchYear != ''){
                busqueda = busqueda + `year=${searchYear}&`
            }if(searchProvince != ''){
                busqueda = busqueda + `province=${searchProvince}&`
            }if(searchGender != ''){
                busqueda = busqueda + `gender=${searchGender}&`
            }if(searchIndefinite_contract_under != ''){
                busqueda = busqueda + `indefinite_contract_under=${searchIndefinite_contract_under}&`
            }if(searchSingle_construction_contract_under != ''){
                busqueda = busqueda + `single_construction_contract_under=${searchSingle_construction_contract_under}&`
            }if(searchMultiple_construction_contract_under != ''){
                busqueda = busqueda + `multiple_construction_contract_under=${searchMultiple_construction_contract_under}&`
            }if(searchSingle_eventual_contract_under != ''){
                busqueda = busqueda + `single_eventual_contract_under=${searchSingle_eventual_contract_under}&`
            }if(searchMultiple_eventual_contract_under != ''){
                busqueda = busqueda + `multiple_eventual_contract_under=${searchMultiple_eventual_contract_under}&`
            }if(searchedFrom != ''){
                busqueda = busqueda + `from=${searchedFrom}&`
            }if(searchedTo != ''){
                busqueda = busqueda + `to=${searchedTo}&`
            }
            busqueda = busqueda.slice(0,-1);
        }
        const redirect_pagina = () => { pagina = 0 };

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
                    warning = "Su búsqueda no ha dado resultados o no existen datos en la base de datos";
                    v_warning = true;
                    f_warning();
                }
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
        }

        async function getHired(query) {
            let newquery = '';
            if (query != ''){
                newquery = '?'+query.slice(1);
            }
            await getCount(newquery);
            if(total != 0){
                resultStatus = result = "";
                const res = await fetch(API+`?offset=${(pagina*itemsPerPage)-1}&limit=${itemsPerPage}${query}`, {
                    method: 'GET'
                });
                try{
                    const data = await res.json();
                    result = JSON.stringify(data,null,2);
                    hireds = data;
                }catch(error){
                    console.log(`Error parsing result: ${error}`);
                }
                const status = await res.status;
                resultStatus = status;	
                if(status==404){
                    warning = "La base de datos se encuentra vacía.";
                    v_warning = true;
                    f_warning();
                }else if(status==200){
                    info = `Mostrando la página ${pagina}.`
                    v_info = true;
                    f_info();
                }else if(status == 500){
                    error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";
                    v_error = true;
                }
            }
        }

        async function loadInitialData() {
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status==201){
                getHired(''); 
                info = "La base de datos ha sido cargada de forma exitosa."
                v_info = true;
                f_info();
            }else if(status==200){
                info = "La base de datos ha sido cargada anteriormente.";
                v_info = true;
                f_info();
            }else if(status == 500){
                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
                v_error = true;
            }
        }

        async function getRecurse() {
            if(specificYear == '' || specificProvince == '' || specificGender == ''){
                warning = 'Para buscar un recurso concreto debe proporcionar año, provincia y género.';
                v_warning = true;
                f_warning();
            }else{
                resultStatus = result = '';
                const res = await fetch(API+`/${specificYear}/${specificProvince}/${specificGender}`, {
                    method: 'GET'
                });
                try{
                    const data = await res.json();
                    result = JSON.stringify(data,null,2);
                    hired = data;
                }catch(error){
                    console.log(`Error parsing result: ${error}`);
                }
                const status = await res.status;
                resultStatus = status;	
                if(status==404){
                    warning = "No existe el dato solicitado.";
                    v_warning = true;
                    f_warning();
                }else if(status==200){
                    location.replace(`/hired-people/${specificYear}/${specificProvince}/${specificGender}`);
                }else if(status == 500){
                    error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
                    v_error = true;
                }
            }
        }
      
        async function createHired() {
            resultStatus = result = '';
            if(newYear=='' || newProvince=='' || newGender=='' ||  newIndefinite_contract=='' || 
            newSingle_construction_contract==''  || newMultiple_construction_contract=='' || 
            newSingle_eventual_contract=='' || newMultiple_eventual_contract==''){
                warning = "No se puede crear si el dato no se pasa completo.";
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
                        gender: newGender,
                        indefinite_contract: newIndefinite_contract,
                        single_construction_contract: newSingle_construction_contract,
                        multiple_construction_contract: newMultiple_construction_contract,
                        single_eventual_contract: newSingle_eventual_contract,
                        multiple_eventual_contract: newMultiple_eventual_contract
                    })
                });
                const status = await res.status;	 
                resultStatus = status;	             
                if(status==201){
                    getHired('');
                    info2 = `El dato ${newYear} ${newProvince} ${newGender} se ha creado correctamente.`;
                    v_info2 = true;
                    f_info2();
                } else if(status==409){
                    warning = `El recurso ${year} ${province} ${gender} ya existe en la base de datos.`;
                    v_warning = true;
                    f_warning();
                }else if(status==400){
                    warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo.`;
                    v_warning = true;
                    f_warning();
                }else if(status == 500){
                    error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
                    v_error = true;
                }
            }
        }

        async function deleteHired(hiredPeople) {
            resultStatus = result = "";
            const res = await fetch(API+"/"+hiredPeople, {
                method: 'DELETE'
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==204){
                queryparser();
                await getHired(busqueda); 
                info2 = `Se ha borrado correctamente el dato ${hiredPeople}.`;
                v_info2 = true;
                f_info2();
                console.log(total);
                if(total == 0){
                    location.reload();
                }
            }else if(status == 400){
                info = `El dato ${hiredPeople} no existe en la base de datos.`;
                v_info = true;
                f_info();
            }else if(status == 500){
                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
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
                    info2 = "Todos los datos han sido borrados.";
                    v_info2 = true;
                    f_info2();
                    resultStatus = "Todos los datos han sido borrados.";
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

    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Datos de las Personas Contratadas en Andalucía</h1></Col>
        </Row>
    </Container>

    <br/>

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
    
    <Container class = 'mb-3'>
        <Row cols={{ xs:2,sm: 2, md: 4, lg: 4, xl:4}}>
            <Col class = 'mb-3'>
                <Button on:click={loadInitialData}>Cargar Datos<Icon name="collection"></Icon></Button>
            </Col>
            <Col class = 'mb-3'>
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
            <Col class = 'mb-3'>
                <Button on:click={() => {crear(); v_buscar1 = false; v_buscar2 = false}}>Introducir Dato</Button>
            </Col>
            <Col class = 'mb-3'>
                <ButtonDropdown>
                    <DropdownToggle color="secondary" caret>Buscar</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem on:click={() => {buscar1(); v_crear = false; v_buscar2 = false}}>Un recurso concreto</DropdownItem>
                      <DropdownItem on:click={() => {buscar2(); v_crear = false; v_buscar1 = false}}>Varios recursos</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
            </Col>
        </Row>
    </Container >

    {#if v_crear}
    <hr class = 'line'/>
        <Container class = 'mb-3'>
            <Row cols={{ xs:2,sm: 2, md: 3, lg: 3, xl:3}}>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="year">Año</Label>
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
                        <Label for="province">Provincia</Label>
                        <Input
                            type="text"
                            id = "province"
                            name="province"
                            placeholder="Escribe una provincia"
                            bind:value={newProvince}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="province">Género</Label>
                        <Input
                            type="text"
                            id = "gender"
                            name="gender"
                            placeholder="Escribe un género"
                            bind:value={newGender}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="indefinite_contract">Contrato Indefinido</Label>
                        <Input
                            type="number"
                            id = "indefinite_contract"
                            name="indefinite_contract"
                            placeholder="Escribe una cifra"
                            bind:value={newIndefinite_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="single_construction_contract">Contrato Único de Construcción</Label>
                        <Input
                            type="number"
                            id = "single_construction_contract"
                            name="single_construction_contract"
                            placeholder="Escribe una cifra"
                            bind:value={newSingle_construction_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="multiple_construction_contract">Contrato Múltiple de Construcción</Label>
                        <Input
                            type="number"
                            id = "multiple_construction_contract"
                            name="multiple_construction_contract"
                            placeholder="Escribe una cifra"
                            bind:value={newMultiple_construction_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="single_eventual_contract">Contrato Único Eventual</Label>
                        <Input
                            type="number"
                            id = "single_eventual_contract"
                            name="single_eventual_contract"
                            placeholder="Escribe una cifra"
                            bind:value={newSingle_eventual_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="multiple_eventual_contract">Contrato Múltiple Eventual</Label>
                        <Input
                            type="number"
                            id = "multiple_eventual_contract"
                            name="multiple_eventual_contract"
                            placeholder="Escribe una cifra"
                            bind:value={newMultiple_eventual_contract}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={createHired}>Crear</Button></Col>
                <Col></Col>
            </Row>
        </Container>
    {/if}

    {#if v_buscar1}
    <hr class = 'line'/>
        <Container class = 'mb-3'>
            <Row><Col>Use este cuadro para buscar un dato concreto, será redirigido a la pantalla de detalles. Ambos datos son requeridos.</Col></Row>
            <br>
            <Row>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="s_year">Año:</Label>
                        <Input
                            type="text"
                            id = "s_year"
                            name="s_year"
                            placeholder="Proporcione un año"
                            bind:value={specificYear}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="s_province">Provincia:</Label>
                        <Input
                            type="text"
                            id = "s_province"
                            name="s_province"
                            placeholder="Proporcione una provincia"
                            bind:value={specificProvince}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="s_gender">Género:</Label>
                        <Input
                            type="text"
                            id = "s_gender"
                            name="s_gender"
                            placeholder="Proporcione un género"
                            bind:value={specificGender}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col><Button on:click={()=>{getRecurse()}} style=align-self:end>Obtener recurso concreto</Button></Col>
            </Row>
        </Container>
    {/if}
    
    {#if v_buscar2}
        <Container class = 'mb-3'>
            <hr class = 'line'/>
            <Row><Col>Use este cuadro para realizar una busqueda, se le mostrará una lista, aunque solo se obtenga un resultado</Col></Row>
            <br>
            <Row cols={{ xs:2,sm: 2, md: 3, lg: 3, xl:4}}>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_year">Año Concreto:</Label>
                        <Input
                            type="number"
                            id = "b_year"
                            name="b_year"
                            placeholder="Busqueda por un año"
                            bind:value={searchYear}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_province">Provincia Concreta:</Label>
                        <Input
                            type="text"
                            id = "b_province"
                            name="b_province"
                            placeholder="Busqueda por una provincia"
                            bind:value={searchProvince}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_gender">Género Concreto:</Label>
                        <Input
                            type="text"
                            id = "b_gender"
                            name="b_gender"
                            placeholder="Busqueda por un género"
                            bind:value={searchGender}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="from">Desde:</Label>
                        <Input
                            type="number"
                            id = "from"
                            name="from"
                            placeholder="Escribe un año"
                            bind:value={searchFrom}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="to">Hasta:</Label>
                        <Input
                            type="number"
                            id = "to"
                            name="to"
                            placeholder="Escribe un año"
                            bind:value={searchTo}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_i_c_under">Contratos Indefinidos menores de:</Label>
                        <Input
                            type="number"
                            id = "b_i_c_under"
                            name="b_i_c_under"
                            placeholder="Escribe una cifra"
                            bind:value={searchIndefinite_contract_under}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_s_c_c_under">Contratos Únicos Construcción menores de:</Label>
                        <Input
                            type="number"
                            id = "b_s_c_c_under"
                            name="b_s_c_c_under"
                            placeholder="Escribe una cifra"
                            bind:value={searchSingle_construction_contract_under}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_m_c_c_under">Contratos Múltiples Construcción menores de:</Label>
                        <Input
                            type="number"
                            id = "b_m_c_c_under"
                            name="b_m_c_c_under"
                            placeholder="Escribe una cifra"
                            bind:value={searchMultiple_construction_contract_under}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_s_e_c_under">Contratos Únicos Eventuales menores de:</Label>
                        <Input
                            type="number"
                            id = "b_s_e_c_under"
                            name="b_s_e_c_under"
                            placeholder="Escribe una cifra"
                            bind:value={searchSingle_eventual_contract_under}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup>
                        <Label for="b_m_e_c_under">Contratos Múltiples Eventuales menores de:</Label>
                        <Input
                            type="number"
                            id = "b_m_e_c_under"
                            name="b_m_e_c_under"
                            placeholder="Escribe una cifra"
                            bind:value={searchMultiple_eventual_contract_under}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={()=>{realizarBusqueda(); redirect_pagina(); getHired(busqueda); vaciarquery();}}>Listar Recursos</Button></Col>
                <Col></Col>
            </Row>
        </Container>
    {/if}
    
    <hr class = 'divider'/>
                
    <Container>
        <Row cols={{ xs:2,sm: 3, md: 3, lg: 3, xl:4}}>
        {#each hireds as hired}
            <Col class = 'mb-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>{capitalizeFirstLetter(hired.year)} {hired.province} {hired.gender}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardText>
                            Contratos Indefinidos: {hired.indefinite_contract} <br>
                            Contratos Únicos de Construcción: {hired.single_construction_contract} <br>
                            Contratos Múltiples de Construcción: {hired.multiple_construction_contract} <br>
                            Contratos Únicos Eventuales: {hired.single_eventual_contract} <br>
                            Contratos Múltiples Eventuales: {hired.multiple_eventual_contract} <br>
                            <Button><a href='hired-people/{hired.province}/{hired.year}'>Editar</a></Button>
                            <Button on:click={deleteHired(`/${hired.year}/${hired.province}/${hired.gender}`)}>Borrar</Button>
                        </CardText>
                    </CardBody>
                </Card>
            </Col>
        {/each}
    </Row>
    </Container>

    <!--Paginación-->

    <Button on:click={previousPage} disabled={pagina === 0}>Anterior</Button>
    <Button on:click={nextPage} disabled={v_lastPage === true}>Siguiente</Button>

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
    .divider{
        background-color: #002366;
        height: 5px;
        margin-left: 15%;
        margin-right: 15%;
    }
    .line{
        background-color: #002366;
        height: 2px;
        margin-left: 15%;
        margin-right: 15%;
    }
</style>