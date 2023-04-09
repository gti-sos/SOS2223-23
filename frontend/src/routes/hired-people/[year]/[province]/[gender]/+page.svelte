<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table } from 'sveltestrap';
        import { page } from '$app/stores';
        onMount(async () => {
            getContact();
        });
        
        let name = $page.params.name;
        let API = '/api/v1/contacts/'+name;
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let updatedContactName = name;
        let updatedContactPhone = 'phone';
        
        let result = "";
        let resultStatus = "";
    
        async function getContact () {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2);
                updatedContactName = data.name;
                updatedContactPhone = data.phone;            
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }
      
        async function updateContact () {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'PUT',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({
                    name: updatedContactName,
                    phone: updatedContactPhone
                })
            });
            const status = await res.status;
            resultStatus = status;	           
            if(status==200){
                getContact();
            }
        }
    </script>
    <h1> Contact Details</h1>
    
    <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td>{updatedContactName}</td>
                <td><input bind:value={updatedContactPhone}></td>
                <td><Button on:click={updateContact}>Update</Button></td>
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