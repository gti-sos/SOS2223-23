<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import {
            Button,
            Alert,
            Table,
            Card,
            CardBody,
            CardHeader,
            CardText,
            CardTitle, 
            FormGroup, 
            Input
        } from 'sveltestrap';
        import { page } from '$app/stores';

        onMount(async () => {
            getRecurse();
        });

        let warning = "";
        let info = "";
        let v_info = false;
        let v_warning = false;
        let errores = "";
        let v_errores = false;
        function f_info() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        function f_warning() {
            (setTimeout(function(){v_info = false;}, 12000));
        }
        
        let province = $page.params.province;
        let year = $page.params.year;
        let API = `/api/v1/ss-affiliates/${province}/${year}`;
        
        if(dev)
            API = 'http://localhost:12345'+API
            
        let updatedRecurseProvince = province;
        let updatedRecurseYear = year;
        let updatedRecurseSs_affiliation = "";
        let updatedRecurseN_cont_indef = "";
        let updatedRecurseN_cont_eventual = "";
        let updatedRecurseN_cont_temporary = "";

        let recurseProvince = province;
        let recurseYear = year;
        let recurseSs_affiliation = 0;
        let recurseN_cont_indef = 0;
        let recurseN_cont_eventual = 0;
        let recurseN_cont_temporary = 0;
        
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
                recurseProvince = data.province;
                recurseYear = data.year;
                recurseSs_affiliation = data.ss_affiliation;
                recurseN_cont_indef = data.n_cont_indef;
                recurseN_cont_eventual = data.n_cont_eventual;
                recurseN_cont_temporary = data.n_cont_temporary;
                           
            }catch(error){

                console.log(`Error parsing result: ${error}`);
            }
            const status = await res.status;
            resultStatus = status;	
            if(status==404){

                warning = "No existe el dato solicitado";

                v_warning = true;

                f_warning();

            }else if(status==200){

                info = "Este es el dato solicitado"

                v_info = true;

                f_info();

            }else if(status == 500){

                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema";

                v_error = true;

            }
        }
      
        async function updateRecurse () {
            if(updatedRecurseSs_affiliation=="" || updatedRecurseN_cont_indef==""|| updatedRecurseN_cont_eventual==""||  updatedRecurseN_cont_temporary==""){
                warning = "No se puede actualizar si el dato no se pasa completo";
                v_warning = true;
            }else{
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

                    info = `El dato ${recurseProvince} ${recurseYear} se ha actualizado correctamente`;

                    v_info = true;

                    f_info();

                }else if(status==404){

                    warning = `El dato ${recurseProvince} ${recurseYear} no existe en la base de datos`;

                    v_warning = true;

                    f_warning();

                }else if(status==400){

                    warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo`;

                    v_warning = true;

                    f_warning();
                }
            }
            
        }
</script>
<main>
    <h1> Detalles del recurso:</h1>

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
            <th>Provincia</th>
            <th>Año</th>
            <th>Afiliados a la Seguridad Social</th>
            <th>Contratos Indefinidos</th>
            <th>Contratos Eventuales</th>
            <th>Contratos Temporales</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
           <tr>
                <td>{updatedRecurseProvince}</td>
                <td>{updatedRecurseYear}</td>
                <td><FormGroup floating label="Nuevos Afiliados">
                    <Input bind:value={updatedRecurseSs_affiliation} placeholder="Nuevos Afiliados"/>
                </FormGroup></td>
                <td><FormGroup floating label="Nuevos Contratos eventuales">
                    <Input bind:value={updatedRecurseN_cont_eventual} placeholder="Nuevos Contratos eventuales"/>
                </FormGroup></td>
                <td><FormGroup floating label="Nuevos Contratos indefinidos">
                    <Input bind:value={updatedRecurseN_cont_indef} placeholder="Nuevos Contratos indefinidos"/>
                </FormGroup></td>
                <td><FormGroup floating label="Nuevos Contratos temporales">
                    <Input bind:value={updatedRecurseN_cont_temporary} placeholder="Nuevos Contratos temporales"/>
                </FormGroup></td>
                <td><Button on:click={updateRecurse}>Actualizar</Button></td>
            </tr>
        </tbody>
      </Table>
      <Card>
        <CardHeader>
          <CardTitle>Dato para {recurseProvince} en {recurseYear}</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            Afiliados a la seguridad Social: {recurseSs_affiliation} <br>
            Nuevos contratos indefinidos: {recurseN_cont_indef} <br>
            Nuevos contratos eventuales: {recurseN_cont_eventual} <br>
            Nuevos contratos temporales: {recurseN_cont_temporary} <br>
          </CardText>
        </CardBody>
      </Card>
</main>