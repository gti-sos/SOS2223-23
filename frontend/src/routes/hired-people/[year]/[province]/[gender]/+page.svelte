<script>
    // @ts-nocheck

        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { page } from '$app/stores';
        import { Button, Table } from 'sveltestrap';
        
        onMount(async () => {
            getHired();
        });

        
        let year = $page.params.year;
        let province = $page.params.province;
        let gender = $page.params.gender;
        let API = '/api/v1/hired-people/'+year+'/'+province+'/'+gender;
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let updatedYear = 'year';
        let updatedProvince = 'province';
        let updatedGender = 'gender';
        let updatedIndefinite_contract = 'indefinite_contract';
        let updatedSingle_construction_contract = 'single_construction_contract';
        let updatedMultiple_construction_contract = 'multiple_construction_contract';
        let updatedSingle_eventual_contract = 'single_eventual_contract';
        let updatedMultiple_eventual_contract = 'multiple_eventual_contract';
        
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
                updatedYear = data.year;
                updatedProvince = data.province;
                updatedGender = data.gender;
                updatedIndefinite_contract = data.indefinite_contract;
                updatedSingle_construction_contract = data.single_construction_contract;
                updatedMultiple_construction_contract = data.multiple_construction_contract;
                updatedSingle_eventual_contract = data.single_eventual_contract;
                updatedMultiple_eventual_contract = data.multiple_eventual_contract;            
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }
      
        async function updateHired() {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'PUT',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    year: updatedYear,
                    province: updatedProvince,
                    gender: updatedGender,
                    indefinite_contract: updatedIndefinite_contract,
                    single_construction_contract: updatedSingle_construction_contract,
                    multiple_construction_contract: updatedMultiple_construction_contract,
                    single_eventual_contract: updatedSingle_eventual_contract,
                    multiple_eventual_contract: updatedMultiple_eventual_contract
                })
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                getHired();
            }
        }

    </script>
    <h1> Contact Details</h1>

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
                <td>{updatedYear}</td>
                <td>{updatedProvince}</td>
                <td>{updatedGender}</td>
                <td><input bind:value={updatedIndefinite_contract}></td>
                <td><input bind:value={updatedSingle_construction_contract}></td>
                <td><input bind:value={updatedMultiple_construction_contract}></td>
                <td><input bind:value={updatedSingle_eventual_contract}></td>
                <td><input bind:value={updatedMultiple_eventual_contract}></td>
                <td><Button on:click={updateHired}>Actualizar</Button></td>
            </tr>
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