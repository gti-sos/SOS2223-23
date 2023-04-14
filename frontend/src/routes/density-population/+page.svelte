<script>
    // @ts-nocheck
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
        import { Button, Table,ButtonToolbar, Input } from 'sveltestrap';
        import { Modal,ModalBody,ModalFooter,ModalHeader, Alert } from 'sveltestrap';
    import { get } from 'svelte/store';

        onMount(async () => {
            getData();
        });

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
        let pagination = 1;

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
            const res = await fetch(API+"?"+"limit=40&"+"offset="+pagination, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2);
                density = data;
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
                success = `El dato ${newYear} ${newProvince} se ha creado correctamente`;
                v_success = true;
            }
            else if(status==409){
                warning = `El dato /${newYear}/${newProvince} ya existe en la base de datos`;
                v_warning = true;
            }else if(status==400){
                warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo`;
                v_warning = true;
            }
        }

        async function getConsult(){
            resultStatus = result = "";
            const res = await fetch(API+"?"+"limit=40&"+"offset="+pagination+"&"+consultAPI, {
                method: "GET"
            });
            console.log(API+"?"+consultAPI);
            try{
                const data = await res.json();
                result = JSON.stringify(data, null, 2);
                density = data;
                
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
            resultStatus = result = "";
            if(consultAPI != ""){
                consultAPI="";
            }
            getData();
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
            <Modal isOpen={open} {toggle}>
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

              <Modal isOpen={myOpen} {myToggle}>
                <ModalHeader {myToggle}>"Consulta API"</ModalHeader>
                <ModalBody>
                    Introduce aquí tu busqueda: <input bind:value={consultAPI}>
                    <p>{consultAPI}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" on:click={() => {getConsult(); myToggle()}}>Consulta</Button>
                  <Button color="secondary" on:click={myToggle}>Cancelar</Button>
                </ModalFooter>
              </Modal>
        </ButtonToolbar>
        <Button outline style=position:absolute;right:0;margin-right:15px color="secondary" on:click={() => 
        {cleanFilter(); myToggle()}}>Borrar consulta</Button>
    </div>
    <div class="pagination">
        <Pagination ariaLabel="Page navigation example">
            <PaginationItem >
              <PaginationLink on:click={() => {pagination=1; getData()}}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem >
                <PaginationLink on:click={() => {pagination=41; getData()}}>2</PaginationLink>
            </PaginationItem>
            <PaginationItem >
                <PaginationLink on:click={() => {pagination=81; getData()}}>3</PaginationLink>
            </PaginationItem>
            <PaginationItem >
                <PaginationLink on:click={() => {pagination=121; getData()}}>4</PaginationLink>
            </PaginationItem>
            <PaginationItem >
                <PaginationLink on:click={() => {pagination=161; getData()}}>5</PaginationLink>
            </PaginationItem>
        </Pagination>
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
                    <td><input placeholder="year" bind:value={newYear}></td>
                    <td><input placeholder="province" bind:value={newProvince}></td>
                    <td><input placeholder="gender" bind:value={newGender}></td>
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
                    <!-- <div>
                        <Button color="danger" on:click={myToggle}>Open Modal</Button>
                        <Modal isOpen={myOpen} {myToggle}>
                          <ModalHeader {myToggle}>Modal title</ModalHeader>
                          <ModalBody>
                            Estas seguro que quieres eliminar este dato?: {datos.year}/{datos.province}/{datos.gender}
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" on:click={deleteData(`${datos.year}/${datos.province}/${datos.gender}`)}>Do Something</Button>
                            <Button color="secondary" on:click={myToggle}>Cancel</Button>
                          </ModalFooter>
                        </Modal>
                    </div> -->


                    <Button color=danger outline  on:click={deleteData(`${datos.year}/${datos.province}/${datos.gender}`)}>Borrar</Button>
                </ButtonToolbar>
                </td>
                <td>&nbsp</td>
              </tr>
              {/each} 
            </tbody>
          </Table>
    </div>
    
</main>
    
    
    
<style>
    .botones{
        display: flex; 
        justify-content: center;
    }
    #enlace_edit{
        text-decoration: none;
        color: grey
    }
</style>