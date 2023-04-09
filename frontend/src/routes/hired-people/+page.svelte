<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table } from 'sveltestrap';
        import { ButtonToolbar } from 'sveltestrap';
        import { Modal,ModalBody,ModalFooter,ModalHeader } from 'sveltestrap';

        onMount(async () => {
            getHired();
        });

        let open = false;
        const toggle = () => (open = !open);
        
        let API = '/api/v1/hired-people';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let hireds = [];
        let newYear = 'year';
        let newProvince = 'province';
        let newGender = 'gender';
        let newIndefinite_contract = 'indefinite_contract';
        let newSingle_construction_contract = 'single_construction_contract';
        let newMultiple_construction_contract = 'multiple_construction_contract';
        let newSingle_eventual_contract = 'single_eventual_contract';
        let newMultiple_eventual_contract = 'multiple_eventual_contract';
        let message = "";
    
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
                resultStatus = "No hay datos cargados.";
            } 
            if(status==201 || status ==200){
                resultStatus = "Los datos han sido cargados.";
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
            if(status==201){
                getHired();
                resultStatus = "El dato ha sido creado.";
            } 
        }

        async function deleteHired(hiredPeople) {
            resultStatus = result = "";
            const res = await fetch(API+"/"+hiredPeople, {
                method: 'DELETE'
            });
            const status = await res.status;          
            if(status==200){
                getHired(); 
                resultStatus = `El dato ${hiredPeople} ha sido borrado.`;	 
            }
        }

        async function loadInitialData() {
            let currentUrl = window.location.href;
            window.location.href = "http://localhost:12345/api/v1/hired-people/loadInitialData";
            await new Promise(resolve => setTimeout(resolve, 10));
            window.location.replace(currentUrl);
        }

        async function deleteAllData() {
            resultStatus = result = "";
            try {
                const res = await fetch(API, {
                method: 'DELETE',
                });
                const status = await res.status;
                if (status === 204) {
                resultStatus = "Todos los datos han sido borrados.";
                console.log('Todos los datos han sido borrados.');
                }
            } catch (error) {
                resultStatus = "Error borrando todos los datos.";
                console.error(`Error borrando todos los datos: ${error}`);
            }
        }
    
    </script>
    
    <h1> Listado de datos: hired-people</h1>
    
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
                <td><input bind:value={newYear}></td>
                <td><input bind:value={newProvince}></td>
                <td><input bind:value={newGender}></td>
                <td><input bind:value={newIndefinite_contract}></td>
                <td><input bind:value={newSingle_construction_contract}></td>
                <td><input bind:value={newMultiple_construction_contract}></td>
                <td><input bind:value={newSingle_eventual_contract}></td>
                <td><input bind:value={newMultiple_eventual_contract}></td>
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
            <td><Button><a href="/hired-people/{hired.year}/{hired.province}/{hired.gender}">Editar</a></Button></td>
            <td><Button on:click={deleteHired(`${hired.year}/${hired.province}/${hired.gender}`)}>Borrar</Button></td>
            <td>&nbsp</td>
          </tr>
          {/each} 
        </tbody>
      </Table>

      {#if message != ""}
      <h1 style="color:red">{message}</h1>
      {/if}
      
    {#if resultStatus != ""}
        <p>
            Resultado:
        </p>
        <pre>
{resultStatus}
{result}
        </pre>
    {/if}

<style>
    a{
        text-decoration : none;
    }
    .botones{
        display: flex; 
        justify-content: center;
    }
</style>