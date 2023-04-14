<script>
    // @ts-nocheck
    
    // ___________________________Imports________________________________________________

        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, 
            Table,
            ButtonToolbar,
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
            Col } from 'sveltestrap';

    //____________________________Inicialización__________________________________________
        onMount(async () => {

            getAffiliation();

        });
    
    //_____________________________Variables de ruta______________________________________
        
        let API = '/api/v2/ss-affiliates';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
    // ____________________________Variables de datos_______________________________________

        let affiliates = []; //Datos
        let pagina = 0;
        const itemsPerPage = 10;
        let lastPage = false;
        function nextPage() {
            if (!lastPage) {
                pagina++;
                getAffiliation();
            }
        }
  
        function previousPage() {
            if (pagina > 1) {
                pagina--;
                getAffiliation();
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
        let open = false;
        const toggle = () => (open = !open);
        
        
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

                getAffiliation(); 

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

        //Obtener datos
        async function getAffiliation() {

            resultStatus = result = "";
            const res = await fetch(API+`?offset=${pagina*itemsPerPage}&limit=${itemsPerPage}`, {
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

                
                lastPage = true;

                v_warning = true;

                f_warning();

            }else if(status==200){

                info = `Mostrando la pagina ${pagina} de la base de datos`

                lastPage = false;

                v_info = true;

                f_info();

            }else if(status == 500){

                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                v_error = true;

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

                    getAffiliation();

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

                getAffiliation(); 

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

                    getAffiliation();

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

    
    <h1> Listado de datos: ss-affiliates</h1>

    {#if errores != ""}
    <Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert>
    {/if}
    {#if warning != ""}
    <Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert>
    {/if}
    {#if info2 != ""}
    <Alert color="info" isOpen={v_info2} toggle={() => (v_info2 = false)}>{info2}</Alert>
    {/if}
    {#if info != ""}
    <Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert>
    {/if}


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

    <Table>
        <thead>
          <tr>
            <th>Año</th>
            <th>Provincia</th>
            <th>Afiliados a la Seguridad Social</th>
            <th>Nuevos Contratos Indefinidos</th>
            <th>Nuevos Contratos Eventuales</th>
            <th>Nuevos contratos Temporales</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td><input bind:value={newYear}></td>
                <td><input bind:value={newProvince}></td>
                <td><input bind:value={newSs_affiliation}></td>
                <td><input bind:value={newN_cont_indef}></td>
                <td><input bind:value={newN_cont_eventual}></td>
                <td><input bind:value={newN_cont_temporary}></td>
                <td><Button on:click={createAffiliation}>Crear</Button></td>
            </tr>
        {#each affiliates as affiliate}
          <tr>
            <td>{affiliate.year}</td>
            <td>{capitalizeFirstLetter(affiliate.province)}</td>
            <td>{affiliate.ss_affiliation}</td>
            <td>{affiliate.n_cont_indef}</td>
            <td>{affiliate.n_cont_eventual}</td>
            <td>{affiliate.n_cont_temporary}</td>
            <td><Button><a href='ss-affiliates/{affiliate.province}/{affiliate.year}'>Editar</a></Button></td>
            <td><Button on:click={deleteAffiliation(`${affiliate.province}/${affiliate.year}`)}>Borrar</Button></td>
            <td>&nbsp</td>
          </tr>
        {/each} 
        </tbody>
    </Table>

    <button on:click={previousPage} disabled={pagina === 0}>Previous</button>
    <button on:click={nextPage} disabled={lastPage === true}>Next</button>
</main>

<style>
    .botones{
        display: flex; 
        justify-content: center;
    }

    a{
        text-decoration: none;
        color: white;
    }

</style>