<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table } from 'sveltestrap';
        import { page } from '$app/stores';
        onMount(async () => {
            getRecurse();
        });
        
        let province = $page.params.province;
        let year = $page.params.year;
        let API = `/api/v1/ss-affiliates/${province}/${year}`;
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let updatedRecurseProvince = province;
        let updatedRecurseYear = year;
        let updatedRecurseSs_affiliation = 0;
        let updatedRecurseN_cont_indef = 0;
        let updatedRecurseN_cont_eventual = 0;
        let updatedRecurseN_cont_temporary = 0;
        
        let result = "";
        let resultStatus = "";
    
        async function getRecurse () {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2); 
                updatedRecurseProvince = data.province;
                updatedRecurseYear = data.year;
                updatedRecurseSs_affiliation = data.ss_affiliation;
                updatedRecurseN_cont_indef = data.n_cont_indef;
                updatedRecurseN_cont_eventual = data.n_cont_eventual;
                updatedRecurseN_cont_temporary = data.n_cont_temporary;           
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }
      
        async function updateRecurse () {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'PUT',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    province: updatedRecurseProvince,
                    year: updatedRecurseYear,
                    ss_affiliation: updatedRecurseSs_affiliation,
                    n_cont_eventual: updatedRecurseN_cont_eventual,
                    n_cont_indef: updatedRecurseN_cont_indef,
                    n_cont_temporary: updatedRecurseN_cont_temporary
                })
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                getRecurse();
            }
        }
</script>
<main>
    <h1> Detalles del recurso:</h1>
    
    <Table>
        <thead>
          <tr>
            <th>Provincia</th>
            <th>Año</th>
            <th>Afiliados a la Seguridad Social</th>
            <th>Nuevos Contratos Indefinidos</th>
            <th>Nuevos Contratos Eventuales</th>
            <th>Nuevos contratos Temporales</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td>{updatedRecurseProvince}</td>
                <td>{updatedRecurseYear}</td>
                <td><input bind:value={updatedRecurseSs_affiliation}></td>
                <td><input bind:value={updatedRecurseN_cont_eventual}></td>
                <td><input bind:value={updatedRecurseN_cont_indef}></td>
                <td><input bind:value={updatedRecurseN_cont_temporary}></td>
                <td><Button on:click={updateRecurse}>Actualizar</Button></td>
            </tr>
     </tbody>
      </Table>


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