<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table, ButtonToolbar, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'sveltestrap';

        onMount(async () => {
            getHired();
        });
        
        let API = '/api/v1/hired-people';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let hireds = [];

        let newYear = '';
        let newProvince = '';
        let newGender = '';
        let newIndefinite_contract = '';
        let newSingle_construction_contract = '';
        let newMultiple_construction_contract = '';
        let newSingle_eventual_contract = '';
        let newMultiple_eventual_contract = '';

        let info = "";
        let v_info = false;
        let warning = "";
        let v_warning = false;
        let errores = "";
        let v_errores = false;
        let open = false;
        const toggle = () => (open = !open);
    
        let result = "";
        let resultStatus = "";
    
        async function getHired() {
            resultStatus = result = "";
            const res = await fetch(API, {
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
                getHired(); 
                info = "La base de datos ha sido cargada de forma exitosa."
                v_info = true;
            }else if(status==200){
                info = "La base de datos ha sido cargada anteriormente.";
                v_info = true;
            }else if(status == 500){
                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
                v_error = true;
            }
        }
      
        async function createHired() {
            resultStatus = result = "";
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
                getHired();
                info = `El datos ${newYear} ${newProvince} ${newGender} se ha creado correctamente.`;
                v_info = true;
            } else if(status==409){
                warning = `El recurso ${year} ${province} ${gender} ya existe en la base de datos.`;
                v_warning = true;
            }else if(status==400){
                warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo.`;
                v_warning = true;
            }
        }

        async function deleteHired(hiredPeople) {
            resultStatus = result = "";
            const res = await fetch(API+"/"+hiredPeople, {
                method: 'DELETE'
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                getHired(); 
                info = `Se ha borrado correctamente el dato ${hiredPeople}.`;
                v_info = true;
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
                    info = "Todos los datos han sido borrados.";
                    v_info = true;
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
    
</script>

<main>
    
    <h1> Listado de datos: hired-people</h1>

    {#if errores != ""}
    <Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert>
    {/if}
    {#if warning != ""}
    <Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert>
    {/if}
    {#if info != ""}
    <Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert>
    {/if}
    
    <div class="botones">
        <ButtonToolbar>
            <Button outline on:click={loadInitialData}>Cargar Datos Iniciales</Button>
            <Button outline on:click={toggle}>Borrar todos los datos</Button>
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
        </ButtonToolbar>
    </div>

    <Table>
        <thead>
          <tr>
            <th>Año</th>
            <th>Provincia</th>
            <th>Género</th>
            <th>Contrato Indefinido</th>
            <th>Contrato de construcción único</th>
            <th>Contrato de construcción múltiple</th>
            <th>Contrato eventual único</th>
            <th>Contrato eventual múltiple</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td><input placeholder="año" bind:value={newYear}></td>
                <td><input placeholder="provincia" bind:value={newProvince}></td>
                <td><input placeholder="genero" bind:value={newGender}></td>
                <td><input placeholder='0' bind:value={newIndefinite_contract}></td>
                <td><input placeholder='0' bind:value={newSingle_construction_contract}></td>
                <td><input placeholder='0' bind:value={newMultiple_construction_contract}></td>
                <td><input placeholder='0' bind:value={newSingle_eventual_contract}></td>
                <td><input placeholder='0' bind:value={newMultiple_eventual_contract}></td>
                <td><Button on:click={createHired}>Crear</Button></td>
            </tr>
    
        {#each hireds as hired}
          <tr>
            <td>{hired.year}</td>
            <td>{hired.province}</td>
            <td>{hired.gender}</td>
            <td>{hired.indefinite_contract}</td>
            <td>{hired.single_construction_contract}</td>
            <td>{hired.multiple_construction_contract}</td>
            <td>{hired.single_eventual_contract}</td>
            <td>{hired.multiple_eventual_contract}</td>
            <td><Button><a id="enlace_edit" href="/hired-people/{hired.year}/{hired.province}/{hired.gender}">Editar</a></Button></td>
            <td><Button on:click={deleteHired(`${hired.year}/${hired.province}/${hired.gender}`)}>Borrar</Button></td>
            <td>&nbsp</td>
          </tr>
          {/each} 
        </tbody>
      </Table>
</main>

<style>
    .botones{
        display: flex; 
        justify-content: center;
    }
    #enlace_edit{
        text-decoration: none;
        color: aquamarine;
    }
</style>