<script>
    // @ts-nocheck

        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { page } from '$app/stores';
        import { Button, Table, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Alert } from 'sveltestrap';
        
        onMount(async () => {
            getHired();
        });

        
        let year = $page.params.year;
        let province = $page.params.province;
        let gender = $page.params.gender;
        let API = `/api/v1/hired-people/${year}/${province}/${gender}`;
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let updatedYear = year;
        let updatedProvince = province;
        let updatedGender = gender;
        let updatedIndefinite_contract = "";
        let updatedSingle_construction_contract = "";
        let updatedMultiple_construction_contract = "";
        let updatedSingle_eventual_contract = "";
        let updatedMultiple_eventual_contract = "";

        let newYear = year;
        let newProvince = province;
        let newGender = gender;
        let newIndefinite_contract = 0;
        let newSingle_construction_contract = 0;
        let newMultiple_construction_contract = 0;
        let newSingle_eventual_contract = 0;
        let newMultiple_eventual_contract = 0;
        
        let info = "";
        let v_info = false;
        let warning = "";
        let v_warning = false;
        let errores = "";
        let v_errores = false;

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
                newYear = data.year;
                newProvince = data.province;
                newGender = data.gender;
                newIndefinite_contract = data.indefinite_contract;
                newSingle_construction_contract = data.single_construction_contract;
                newMultiple_construction_contract = data.multiple_construction_contract;
                newSingle_eventual_contract = data.single_eventual_contract;
                newMultiple_eventual_contract = data.multiple_eventual_contract;            
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }
      
        async function updateHired() {
            if(updatedIndefinite_contract=="" || updatedSingle_construction_contract==""|| updatedMultiple_construction_contract==""||  updatedSingle_eventual_contract==""|| updatedMultiple_eventual_contract==""){
                warning = "No se puede actualizar si el dato no se pasa completo.";
                v_warning = true;
            }else{
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
                    info = "El dato ha sido actualizado correctamente."
                    v_info = true;
                }
            }
        }

</script>

<main>

    <h1> Detalles del Recurso</h1>

    {#if errores != ""}
    <Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert>
    {/if}
    {#if warning != ""}
    <Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert>
    {/if}
    {#if info != ""}
    <Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert>
    {/if}

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
                <td><input placeholder='0' bind:value={updatedIndefinite_contract}></td>
                <td><input placeholder='0' bind:value={updatedSingle_construction_contract}></td>
                <td><input placeholder='0' bind:value={updatedMultiple_construction_contract}></td>
                <td><input placeholder='0' bind:value={updatedSingle_eventual_contract}></td>
                <td><input placeholder='0' bind:value={updatedMultiple_eventual_contract}></td>
                <td><Button on:click={updateHired}>Actualizar</Button></td>
            </tr>
     </tbody>
    </Table>
    <Card>
        <CardHeader>
          <CardTitle>Dato para {newGender} de {newProvince} en {newYear}</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            Contratos Indefinidos: {newIndefinite_contract} <br>
            Contratos Únicos de Construcción: {newSingle_construction_contract} <br>
            Contratos Múltiples de Construcción: {newMultiple_construction_contract} <br>
            Contratos Únicos Eventuales: {newSingle_eventual_contract} <br>
            Contratos Múltiples Eventuales: {newMultiple_eventual_contract} <br>
          </CardText>
        </CardBody>
      </Card>
</main>