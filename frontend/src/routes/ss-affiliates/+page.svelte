<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table, ButtonToolbar } from 'sveltestrap';
        onMount(async () => {
            getAffiliation();
        });
        
        let API = '/api/v1/ss-affiliates';
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let affiliates = [];
        let newYear = 'year';
        let newProvince = 'province';
        let newSs_affiliation = 'ss_affiliation';
        let newN_cont_indef = 'n_cont_indef';
        let newN_cont_eventual = 'n_cont_eventual';
        let newN_cont_temporary = 'n_cont_temporary';
        let message = "";
    
        let result = "";
        let resultStatus = "";
    
        async function loadData() {
            resultStatus = result = "";
            const res = await fetch(API+'/loadInitialData', {
                method: 'GET'
            });
            const status = await res.status;
            resultStatus = status;
            if(status==201){
                getAffiliation(); 
            }	
        }

        async function getAffiliation() {
            resultStatus = result = "";
            const res = await fetch(API, {
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
        }
      
        async function createAffiliation() {
            resultStatus = result = "";
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
            } 
            if(status==200){
                getAffiliation();
            }
        }

        async function deleteAffiliation(affiliate) {
            resultStatus = result = "";
            const res = await fetch(API+"/"+affiliate, {
                method: 'DELETE'
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                getAffiliation(); 
            }
        }
    
</script>
<main>
    <h1> Listado de datos: ss-affiliates</h1>
    
    <div class="botones">
        <ButtonToolbar>
            <Button outline on:click={loadData}>Cargar Datos Iniciales</Button>
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
            <td>{affiliate.province}</td>
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

</main>

<style>
    .botones{
        display: flex; 
        justify-content: center;
    }
</style>