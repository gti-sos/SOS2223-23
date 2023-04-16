<script>
    // @ts-nocheck
    
        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { Button, Alert, Table, Card, CardBody, CardHeader, CardText,
            CardTitle, FormGroup, Input, Row, Col, Container
        } from 'sveltestrap';
        import { page } from '$app/stores';

        onMount(async () => {
            getRecurse();
        });

        let warning = "";
        let info = "";
        let v_info = false;
        let info2 = "";
        let v_info2 = false;
        let v_warning = false;
        let errores = "";
        let v_errores = false;
        function f_info() {
            (setTimeout(function(){v_info = false;}, 6000));
        }
        function f_info2() {
            (setTimeout(function(){v_info2 = false;}, 6000));
        }
        function f_warning() {
            (setTimeout(function(){v_info = false;}, 12000));
        }
        
        let province = $page.params.province;
        let year = $page.params.year;
        let API = `/api/v2/ss-affiliates/${province}/${year}`;
        
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

        let v_actualizar = false;
        const actualizar = () => (v_actualizar = !v_actualizar);
    
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
            console.log(updatedRecurseSs_affiliation+updatedRecurseN_cont_indef+updatedRecurseN_cont_eventual+updatedRecurseN_cont_temporary)
            if(updatedRecurseSs_affiliation==="" || updatedRecurseN_cont_indef===""|| updatedRecurseN_cont_eventual===""||  updatedRecurseN_cont_temporary===""){
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

                    info2 = `El dato ${recurseProvince} ${recurseYear} se ha actualizado correctamente`;

                    v_info2 = true;

                    f_info2();

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
    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Detalles del recurso</h1></Col>
        </Row>
    </Container>

    <br/>

    <Container>
    {#if errores != ""}
    <Row><Col><Alert color="danger" isOpen={v_errores} toggle={() => (v_errores = false)}>{errores}</Alert></Col></Row>
    {/if}
    {#if warning != ""}
    <Row><Col><Alert color="warning" isOpen={v_warning} toggle={() => (v_warning = false)}>{warning}</Alert></Col></Row>
    {/if}
    {#if info != ""}
    <Row><Col><Alert color="info" isOpen={v_info} toggle={() => (v_info = false)}>{info}</Alert></Col></Row>
    {/if}
    {#if info2 != ""}
    <Row><Col><Alert color="info" isOpen={v_info2} toggle={() => (v_info2 = false)}>{info2}</Alert></Col></Row>
    {/if}
    </Container>
    
    <Container class = 'mb-3'>
        <Row>
            <Col class = 'mb-3' sm={{ size: 'auto', offset: 2 }}>
                <Button on:click={() => {location.replace('/ss-affiliates')}}>Volver atrás</Button>
            </Col>
            <Col class = 'mb-3' sm={{ size: 'auto', offset: 3 }}>
                <Button on:click={actualizar}>Modificar Dato</Button>
            </Col>
        </Row>
    </Container>


    {#if v_actualizar}
    <hr class = 'line'/>
        <Container class = 'mb-3'>
            <Row cols={{ xs:2,sm: 2, md: 4, lg: 4, xl:4}}>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Nuevos Afiliados">
                        <Input
                            type="number"
                            id = "affiliate"
                            name="affiliate"
                            placeholder="Escribe una cifra"
                            bind:value={updatedRecurseSs_affiliation}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Nuevos Contratos eventuales" >
                        <Input
                            type="number"
                            id = "indef"
                            name="indef"
                            placeholder="Escribe una cifra"
                            bind:value={updatedRecurseN_cont_eventual}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Nuevos Contratos indefinidos">
                        <Input
                            type="number"
                            id = "event"
                            name="event"
                            placeholder="Escribe una cifra"
                            bind:value={updatedRecurseN_cont_indef}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Nuevos Contratos temporales">
                        <Input
                            type="number"
                            id = "temp"
                            name="temp"
                            placeholder="Escribe una cifra"
                            bind:value={updatedRecurseN_cont_temporary}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={updateRecurse}>Actualizar</Button></Col>
                <Col></Col>
            </Row>
        </Container>
    {/if}

    <hr class = 'divider'/>
    <Container>
        <Row>
            <Col xs={{size:'12'}} sm={{ size: '12' }} md={{ size: '6', offset: 3 }} lg={{ size: '6', offset: 3 }} xl={{ size: '6', offset: 3 }}>
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
            </Col>
        </Row>
    </Container>
      
</main>

<style>

    .divider{
        background-color: #002366;
        height: 5px;
        margin-left: 15%;
        margin-right: 15%;
    }
    .line{
        background-color: #002366;
        height: 2px;
        margin-left: 15%;
        margin-right: 15%;
    }
</style>