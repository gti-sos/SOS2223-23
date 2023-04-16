<script>
    // @ts-nocheck
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table,ButtonToolbar, Input,Container, Row, Col } from 'sveltestrap';
        import { Modal,ModalBody,ModalFooter,ModalHeader, Alert, FormGroup, Label } from 'sveltestrap';
        import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';


        onMount(async () => {
            getData();
            countData();
        });
        //datos para funciones
        let valor = -1;
        let warning = "";
        let info = "";
        let v_info = false;
        let v_warning = false;
        let errores = "";
        let v_errores = false;
        let success = "";
        let v_success = false;
        let open = false;
        let myOpen = false;
        let consultAPI = "";
        let v_consult = true;
        let pagination = 0;
        
        //datos para consulta
        let specificYear = null;
        let province = null;
        let gender = null;
        let fromYear = null;
        let toYear = null;
        let munLessThan = null;
        let munBetween = null;
        let munGreaterThan = null;
        let capital = null;

        const toggle = () => (open = !open);
        const myToggle = () => (myOpen = !myOpen);
        
        let API = '/api/v2/density-population';
        
        if(dev)
            API = 'http://localhost:12345'+API
        
        
            

        let density = [];

        let newYear = '';
        let newProvince = '';
        let newGender = '';
        let newMunicipality_size_lt_ft = '';
        let newMunicipality_size_bt_ft_tht= '';
        let newMunicipality_size_gt_tht = '';
        let newCapital_size = '';
    
        let result = "";
        let resultStatus = "";

        async function loadData() {
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status===201){
                getData();
                countData();
                success = "La base de datos se ha cargado correctamente";
                v_success = true;

            }else if(status==200){

                info = "La base de datos ya está cargada, si quiere cargar los datos iniciales, borre los datos existentes";

                v_info = true;

            }else if(status == 500){

                error = "Ha ocurrido un error en el servidor";

                v_error = true;
            }
        }


        async function getData() {
            resultStatus = result = "";
            const res = await fetch(API+"?"+"limit=10&"+"offset="+pagination*10, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2);
                density = data;
                v_consult = true;
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            

            const status = await res.status;
            resultStatus = status;	
            if(status==404){
                warning = "No hay datos cargados en la base de datos";
                v_warning = true;
                countData();
            } 
            if(status ==201){
                success = `Los datos han sido cargados`;
                v_success = true;
                countData();
            } 
            
        }

        async function deleteData(data){
            resultStatus = result = "";
            const res = await fetch(API+"/"+data, {
                method: 'DELETE'
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                
                console.log("Dato borrado: "+data)
                success = `Se ha borrado correctamente el dato ${data}`;
                v_success = true;
                getData();
            }
        }

        async function deleteAllData() {
            resultStatus = result = "";
            try {
                const res = await fetch(API, {
                method: 'DELETE',
                });
                const status = await res.status;
                if (status === 200 || status === 204) {
                    success = "Todos los datos han sido borrados";
                    v_success = true;

                }
            } catch (err) {
                errores = error
                v_errores = true;
                resultStatus = 'Ha ocurrido un error al eliminar los datos: ', err;
                console.error('Ha ocurrido un error al eliminar los datos: ', err);
            }
        }


        async function createData() {
            resultStatus = result = "";
            if(newYear == "" || newProvince == "" || newMunicipality_size_lt_ft == "" ||newMunicipality_size_bt_ft_tht == "" ||
            newMunicipality_size_gt_tht == "" ||newCapital_size == ""){
                resultStatus = 404
                warning = `Es necesario rellenar todos los campos para crear un recurso`;
                v_warning = true;
                return resultStatus
            } 
            const res = await fetch(API, {
                method: 'POST',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    year: newYear,
                    province: newProvince,
                    gender: newGender,
                    municipality_size_lt_ft: newMunicipality_size_lt_ft,
                    municipality_size_bt_ft_tht: newMunicipality_size_bt_ft_tht,
                    municipality_size_gt_tht: newMunicipality_size_gt_tht,
                    capital_size: newCapital_size 
                })
            });
            const status = await res.status;
            resultStatus = status;
                     
            if(status==201){
                getData();
                location.reload();
                success = `El dato /${newYear}/${newProvince}/${newGender} se ha creado correctamente`;
                v_success = true;
            }
            else if(status==409){
                warning = `El dato /${newYear}/${newProvince}/${newGender} ya existe en la base de datos`;
                v_warning = true;
            }else if(status==400){
                warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo`;
                v_warning = true;
            }
        }

        function formConsult(){
            consultAPI = '';
            if(specificYear != null){
                consultAPI = consultAPI + `year=${specificYear}&`
            }if(province != null){
                consultAPI = consultAPI + `province=${province}&`
            }if(gender != null){
                consultAPI = consultAPI + `gender=${gender}&`
            }if(fromYear != null){
                consultAPI = consultAPI + `from=${fromYear}&`
            }if(toYear != null){
                consultAPI = consultAPI + `to=${toYear}&`
            }if(munLessThan != null){
                consultAPI = consultAPI + `municipality_size_lt_ft_under=${munLessThan}&`
            }if(munBetween != null){
                consultAPI = consultAPI + `municipality_size_bt_ft_tht_under=${munBetween}&`
            }if(munGreaterThan != null){
                consultAPI = consultAPI + `municipality_size_gt_tht_under=${munGreaterThan}&`
            }if(capital != null){
                consultAPI = consultAPI + `capital_size_under=${capital}&`
            }
            console.log(consultAPI)
        }

        async function getConsult(){
            resultStatus = result = "";
            formConsult();
            const res = await fetch(API+"?"+consultAPI, {
                method: "GET"
            });
            console.log(API+"?"+consultAPI+"limit=10&"+"offset="+pagination);
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                density = data;
                v_consult = false;
                
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;
            if(status==404){
                warning = "No hay datos cargados en la base de datos";
                v_warning = true;
            } 
            if(status ==201){
                success = `Los datos han sido cargados`;
                v_success = true;
            } 
        }
        async function cleanFilter(){
            consultAPI = "";
            specificYear = null;
            province = null;
            gender = null;
            fromYear = null;
            toYear = null;
            munLessThan = null;
            munBetween = null;
            munGreaterThan = null;
            capital = null;
            getData();
        }
        
        async function countData(){
            const res = await fetch(API, {
                method: 'GET'
            });
            const data = await res.json()
            let numElements = Array.isArray(data) ? data.length : 0;
            let ultPage = Math.floor(numElements/10);
            valor = ultPage;
        }

        function firstPage() {
            pagination=0;
            getData();
        }

        function nextPage() {
            if (pagination!=valor) {
                pagination++;
                getData();
            }
        }
  
        function previousPage() {
            if (pagination >= 1) {
                pagination--;
                getData();
            }
        }
        function lastPage() {
            pagination=valor;
            getData();
        }
        function infoPage(inf,v_inf){
            info = inf;
            v_info = v_inf;
        }


</script>
<main>
    <h1>Listado de datos: Densidad de Poblacion</h1>
    <hr>

    {#if errores != ""}
    <Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert>
    {/if}
    {#if warning != ""}
    <Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert>
    {/if}
    {#if info != ""}
    <Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert>
    {/if}
    {#if success != ""}
    <Alert color="success" isOpen={v_success} toggle={() => (v_success = false)}>{success}</Alert>
    {/if}
    
    <div class="botones" >
        <ButtonToolbar>
            <Button color=primary class=botones_iniciales outline on:click={loadData}>Cargar Datos Iniciales</Button>

            <Button color=primary class=botones_iniciales outline on:click={toggle}>Borrar todos los datos</Button>
            <Modal  isOpen={open} {toggle}>
            <ModalHeader {toggle}>Eliminar Datos</ModalHeader>
            <ModalBody>
                ¿Estás seguro que quieres eliminar todos los datos?
            </ModalBody>
            <ModalFooter>
                <Button color="danger" on:click={() => { deleteAllData(); toggle(); location.reload()}}>Eliminar</Button>
                <Button color="secondary" on:click={toggle}>Cancelar</Button>
            </ModalFooter>
            </Modal>

            <Button color=primary class=botones_iniciales outline on:click={myToggle}>Consulta especial</Button>
            <Modal isOpen={myOpen} {myToggle}>
                
              </Modal>

              <Modal class="modal-dialog modal-xl" isOpen={myOpen} {myToggle}>
                <ModalHeader {myToggle}>"Consulta"</ModalHeader>
                <ModalBody >
                    <Container class = 'mb-3'>
                        <Row><Col><h5>Introduzca los valores por los que quiere consultar datos</h5></Col></Row>
                        <hr>
                        <Row><Col><h6>Estos campos devolverán un único dato</h6></Col></Row>
                        <br>
                        {consultAPI}  
                        <!-- -->
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Por año:</Label>
                                    <Input
                                        disabled={fromYear != null || toYear != null || munLessThan !=null ||
                                        munBetween !=null || munGreaterThan || capital !=null ? true:false}
                                        type="number"                                     
                                        placeholder="Busqueda por un año"
                                        bind:value={specificYear}                                      
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>Por provincia:</Label>
                                    <Input
                                        disabled={fromYear != null || toYear != null || munLessThan !=null ||
                                        munBetween !=null || munGreaterThan || capital!=null ? true:false}
                                        type="text"                                       
                                        placeholder="Busqueda por una provincia"
                                        bind:value={province} 
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>Por género:</Label>
                                    <Input
                                        disabled={fromYear != null || toYear != null || munLessThan !=null ||
                                        munBetween !=null || munGreaterThan || capital!=null ? true:false}
                                        type="text"                                        
                                        placeholder="Busqueda por género"
                                        bind:value={gender}                                        
                                    />
                                </FormGroup>
                            </Col>
                            
                        </Row>
                        <hr>
                        <Row><Col><h6>Estos campos devolverán todos los datos que se correspondan con la consulta solicitada</h6></Col></Row>
                        <br>
                        <Row>
                            <Col class = 'mb-3'>
                                <FormGroup>
                                    <Label>Desde el año:</Label>
                                    <Input 
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe un año"
                                        bind:value={fromYear}                                        
                                    />
                                </FormGroup>
                            </Col>
                            <Col class = 'mb-3'>
                                <FormGroup>
                                    <Label>Hasta el año:</Label>
                                    <Input
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe un año"
                                        bind:value={toYear} 
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            
                            <Col>
                                <FormGroup>
                                    <Label>Hasta la densidad de poblacion para municipios pequeños</Label>
                                    <Input
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe una cifra"
                                        bind:value={munLessThan} 
                                    />
                                </FormGroup>
                            </Col>
                            <Col class = 'mb-3'>
                                <FormGroup>
                                    <Label>Hasta la densidad de poblacion para municipios medianos</Label>
                                    <Input
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe una cifra"
                                        bind:value={munBetween} 
                                    />
                                </FormGroup>
                            </Col>
                            <Col class = 'mb-3'>
                                <FormGroup>
                                    <Label>Hasta la densidad de poblacion para municipios grandes</Label>
                                    <Input
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe una cifra"
                                        bind:value={munGreaterThan} 
                                    />
                                </FormGroup>
                            </Col>
                            <Col class = 'mb-3'>
                                <FormGroup>
                                    <Label>Hasta la densidad de poblacion para capitales</Label>
                                    <Input
                                        disabled={specificYear != null || province != null || gender !=null ? true:false}
                                        type="number"
                                        placeholder="Escribe una cifra"
                                        bind:value={capital} 
                                    />
                                </FormGroup>
                            </Col>
                            
                        </Row>
                    </Container>

                </ModalBody>
                <ModalFooter>
                  <Button color="primary" on:click={() => {getConsult(); myToggle()}}>Consulta</Button>
                  <Button color="secondary" on:click={myToggle}>Cancelar</Button>
                </ModalFooter>
              </Modal>
        </ButtonToolbar>
        <Button outline style=position:absolute;right:0;margin-right:15px color="secondary" on:click={() => 
        {cleanFilter();infoPage("Se han limpiado los campos de consulta",true)}}>Borrar consulta</Button>
    </div>
    <div>
        
      </div>
    
    <div class="tabla">
        <Table hover>
            <thead>
              <tr>
                <th>Año</th>
                <th>Provincia</th>
                <th>Género</th>
                <th>Densidad de poblacion en municipios pequeños</th>
                <th>Densidad de poblacion en municipios medianos</th>
                <th>Densidad de poblacion en municipios grandes</th>
                <th>Densidad de poblacion en capitales</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
               <tr>
                    <td><input placeholder="Introduce el año" bind:value={newYear}></td>
                    <td><input placeholder="Introduce la provincia" bind:value={newProvince}></td>
                    <td><input placeholder="Introduce el género" bind:value={newGender}></td>
                    <td><input placeholder="0" bind:value={newMunicipality_size_lt_ft}></td>
                    <td><input placeholder="0" bind:value={newMunicipality_size_bt_ft_tht}></td>
                    <td><input placeholder="0" bind:value={newMunicipality_size_gt_tht}></td>
                    <td><input placeholder="0" bind:value={newCapital_size}></td>
                    <td><Button outline color=success on:click={createData}>Crear</Button></td>
                    
                </tr>
        
            {#each density as datos}
              <tr>
                <td>{datos.year}</td>
                <td>{datos.province}</td>
                <td>{datos.gender}</td>
                <td>{datos.municipality_size_lt_ft}</td>
                <td>{datos.municipality_size_bt_ft_tht}</td>
                <td>{datos.municipality_size_gt_tht}</td>
                <td>{datos.capital_size}</td>
                <td class="botones-accion">
                <ButtonToolbar>
                    <Button color=warning outline><a id="enlace_edit" href="/density-population/{datos.year}/{datos.province}/{datos.gender}">Editar</a></Button>
                    <Button color=danger outline  on:click={deleteData(`${datos.year}/${datos.province}/${datos.gender}`)}>Borrar</Button>
                </ButtonToolbar>
                </td>
                <td>&nbsp</td>
              </tr>
              {/each} 
            </tbody>
          </Table>
    </div>
    
    <Pagination ariaLabel="Page navigation example">
        {#if v_consult}
            <PaginationItem>
                <PaginationLink style=color:#696969 first on:click={() => {firstPage();infoPage(`Mostrando la página: ${pagination+1} de ${valor+1}`,
                    true)}} disabled={pagination === 0}></PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink style=color:#696969 on:click={()=>{previousPage();infoPage(`Mostrando la página: ${pagination+1} de ${valor+1}`,
                    true)}} disabled={pagination === 0}>Previous</PaginationLink>
            </PaginationItem>
            <PaginationItem >
                <PaginationLink style=color:#696969 on:click={() => {countData();nextPage();infoPage(`Mostrando la página: ${pagination+1} de ${valor+1}`,
                    true)}} disabled={pagination === valor}>Next</PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink style=color:#696969 last on:click={()=>{lastPage();infoPage(`Mostrando la página: ${pagination+1} de ${valor+1}`,
                true)}} disabled={pagination === valor}></PaginationLink>
            </PaginationItem>
        {/if}
    </Pagination>
    
</main>
    
    
    
<style>
    
    .botones{
        display: flex; 
        justify-content: center;
    }
    #enlace_edit{
        text-decoration: none;
        color: #696969;
    }
</style>