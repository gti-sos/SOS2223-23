<script>
    // @ts-nocheck
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Table, } from 'sveltestrap';
        import { Toast,ToastHeader,ToastBody } from 'sveltestrap';
        import { page } from '$app/stores';

        onMount(async () => {
            getData();
        });

        let year = $page.params.year;
        let province = $page.params.province;
        let gender = $page.params.gender;
        let API = `/api/v1/density-population/${year}/${province}/${gender}`;

        if(dev)
            API = 'http://localhost:12345'+API
                    
        let updatedYear = year;
        let updatedProvince = province;
        let updatedGender = gender;
        let updatedMunicipality_size_lt_ft = "";
        let updatedMunicipality_size_bt_ft_tht= "";
        let updatedMunicipality_size_gt_tht = "";
        let updatedCapital_size = "";

        let Province = province;
        let Year = year;
        let Municipality_size_lt_ft = 0;
        let Municipality_size_bt_ft_tht = 0;
        let Municipality_size_gt_tht = 0;
        let Capital_size = 0;

        let result = "";
        let resultStatus = "";

        async function getData() {
            resultStatus = result = "";
            const res = await fetch(API, {
                method: 'GET'
            });
            try{
                const data = await res.json();
                result = JSON.stringify(data,null,2); 
                Year = data.year;
                Province = data.province;
                updatedGender = data.gender;
                Municipality_size_lt_ft = data.municipality_size_lt_ft;
                Municipality_size_bt_ft_tht = data.municipality_size_bt_ft_tht;
                Municipality_size_gt_tht = data.municipality_size_gt_tht;
                Capital_size = data.capital_size;           
            }catch(error){
                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
        }

        async function updateData () {
            if(updatedMunicipality_size_lt_ft=="" || updatedMunicipality_size_bt_ft_tht==""|| updatedMunicipality_size_gt_tht==""||  updatedCapital_size==""){
                warning = "Faltan datos para poder editar el recurso";
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
                        municipality_size_lt_ft: updatedMunicipality_size_lt_ft,
                        municipality_size_bt_ft_tht: updatedMunicipality_size_bt_ft_tht,
                        municipality_size_gt_tht: updatedMunicipality_size_gt_tht,
                        capital_size: updatedCapital_size
                    })
                });
                const status = await res.status;
                resultStatus = status;	           
                if(status==200){
                    getData();
                }
            }
        }

</script>
<main>
    <h1> Detalles del recurso:</h1>
    
    <Table>
        <thead>
          <tr>
            <th>Año</th>
            <th>Provincia</th>
            <th>Género</th>
            <th>Densidad de poblacion en municipios pequeños</th>
            <th>Densidad de poblacion en municipios medianos</th>
            <th>Densidad de poblacion en municipios grandes</th>
            <th>Densidad de poblacion en capitales</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td>{updatedYear}</td>
                <td>{updatedProvince}</td>
                <td>{updatedGender}</td>
                <td><input placeholder="0" bind:value={updatedMunicipality_size_lt_ft}></td>
                <td><input placeholder="0" bind:value={updatedMunicipality_size_bt_ft_tht}></td>
                <td><input placeholder="0" bind:value={updatedMunicipality_size_gt_tht}></td>
                <td><input placeholder="0" bind:value={updatedCapital_size}></td>
                <td><Button on:click={updateData}>Actualizar</Button></td>
            </tr>
     </tbody>
      </Table>

      <div class="p-3 mb-3">
        <Toast>
          <ToastHeader icon=primary>Dato para {Year} en {Province}</ToastHeader>
          <ToastBody>
            Densidad de poblacion en municipios pequeños: {Municipality_size_lt_ft} <br>
            Densidad de poblacion en municipios medianos: {Municipality_size_bt_ft_tht} <br>
            Densidad de poblacion en municipios grandes: {Municipality_size_gt_tht} <br>
            Densidad de poblacion en municipios capitales: {Capital_size} <br>
          </ToastBody>
        </Toast>
      </div>
</main>