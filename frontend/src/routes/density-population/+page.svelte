<script>
    // @ts-nocheck
        import { ButtonToolbar } from 'sveltestrap';
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table } from 'sveltestrap';
        import { Modal,ModalBody,ModalFooter,ModalHeader } from 'sveltestrap';

        
        let open = false;
        const toggle = () => (open = !open);


        onMount(async () => {
            getData();
        });
        
        let API = '/api/v1/density-population';
        
        if(dev)
            API = 'http://localhost:12345'+API
        
        
            

        let density = [];
        let newYear = 'year';
        let newProvince = 'province';
        let newGender = 'gender';
        let newMunicipality_size_lt_ft = "newMunicipality_size_lt_ft";
        let newMunicipality_size_bt_ft_tht= "newMunicipality_size_bt_ft_tht";
        let newMunicipality_size_gt_tht = "newMunicipality_size_gt_tht";
        let newCapital_size = "newCapital_size"
    
        let result = "";
        let resultStatus = "";
    
        async function loadData() {
            let currentUrl = window.location.href;
            
            // Redirigimos al usuario a la URL deseada
            window.location.href = "http://localhost:12345/api/v1/density-population/loadInitialData";
            
            // Esperamos a que se complete la redirección y se carguen los datos
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirigimos al usuario de vuelta a la URL original
            window.location.replace(currentUrl);
        }


        async function getData() {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2);
                density = data;
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }
      
        async function editData(){
            return null;
        }

        async function deleteData(){
            return null;
        }
        
        
        // <Button color="primary" on:click={toggle}>Hello World!</Button>
        // <Modal body {isOpen} {toggle} header="Hello World!">
        // <p>There's a song that we're singing. Come on</p>
        // <img
        //     src="https://i.ytimg.com/vi/NUJIRujygvY/hqdefault.jpg"
        //     alt="Come on Get Happy"
        //     class="img-fluid"
        // />
        // </Modal>

        async function deleteAllData() {
            
            try {
                const res = await fetch(API, {
                method: 'DELETE',
                });
                const status = await res.status;
                if (status === 204) {
                console.log('Todos los datos han sido eliminados.');
                }
            } catch (err) {
                console.error('Ha ocurrido un error al eliminar los datos: ', err);
            }
        }


        async function createData () {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'POST',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    name: newContactName,
                    phone: newContactPhone
                })
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==201){
                getData();
            }

        }
    
</script>
<main>
    <h1>Api of density-population</h1>
    <hr>

    
    <div class="botones">
        <ButtonToolbar>
            <Button outline on:click={loadData}>Cargar Datos Iniciales</Button>
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

    <div>
        
      </div>
    
    <div class="tabla">
        <Table hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Province</th>
                <th>Gender</th>
                <th>Municipality_size_lt_ft</th>
                <th>Municipality_size_bt_ft_tht</th>
                <th>Municipality_size_gt_tht</th>
                <th>Capital_size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
               <tr>
                    <td><input bind:value={newYear}></td>
                    <td><input bind:value={newProvince}></td>
                    <td><input bind:value={newGender}></td>
                    <td><input bind:value={newMunicipality_size_lt_ft}></td>
                    <td><input bind:value={newMunicipality_size_bt_ft_tht}></td>
                    <td><input bind:value={newMunicipality_size_gt_tht}></td>
                    <td><input bind:value={newCapital_size}></td>
                    <td><Button on:click={createData}>Create</Button></td>
                    
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
                <td>
                <ButtonToolbar>
                    <Button on:click={editData}>Edit</Button>
                    <Button on:click={deleteData}>Delete</Button>
                </ButtonToolbar>
                </td>
                <td>&nbsp</td>
              </tr>
              {/each} 
            </tbody>
          </Table>
    
          
        {#if resultStatus != ""}
            <p>
                Result:
            </p>
            <pre>
    {resultStatus}
    {result}
            </pre>
        {/if}
    </div>
    
</main>
    
    
    
<style>
    .botones{
        display: flex; 
        justify-content: center;
    }
</style>