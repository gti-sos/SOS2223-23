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
        let total = 0;
        let pagina = 0;
        const itemsPerPage = 10;
        let lastPage = 0;
        let v_lastPage = true;
        function nextPage() {
            if (!v_lastPage) {
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

        async function getCount(){
            resultStatus = result = "";
            const res = await fetch(API+`/count`, {
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
        async function getAffiliation() {
            await getCount();
            if (total != 0){
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

    <div class = "esquema"> </div>
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
        </tbody>
    </Table>

    <div class = 'container'>
        {#each affiliates as affiliate, i}
            <div class = "item{i}"><Card>
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
              </Card></div>
        {/each}
    </div>

    <button on:click={previousPage} disabled={pagina === 0}>Previous</button>
    <button on:click={nextPage} disabled={v_lastPage === true}>Next</button>
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

    .container{
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        justify-content: start;
        align-content: start;
        row-gap: 1rem;
    }
    .item1{
        grid-area: 1/1/2/2;
        justify-self: left;
        align-self: start;
    }
    .item2{
        grid-area: 1/2/2/3;
        justify-self: center;
        align-self: center;
    }
    .item3{
        grid-area: 1/3/2/4;
        justify-self: right;
        align-self: center;
    }
    .item4{
        grid-area: 2/1/3/2;
        justify-self: left;
        align-self: center;
    }
    .item5{
        grid-area: 2/2/3/3;
        justify-self: center;
        align-self: center;
    }
    .item6{
        grid-area: 2/3/3/4;
        justify-self: right;
        align-self: center;
    }
    .item7{
        grid-area: 3/1/4/2;
        justify-self: left;
        align-self: center;
    }
    .item8{
        grid-area: 3/2/4/3;
        justify-self: center;
        align-self: center;
    }
    .item9{
        grid-area: 3/3/4/4;
        justify-self: right;
        align-self: center;
    }
    .item10{
        grid-area: 4/1/5/2;
        justify-self: left;
        align-self: center;
    }
</style>