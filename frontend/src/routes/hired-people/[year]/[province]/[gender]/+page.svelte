<script>
    // @ts-nocheck

        import { onMount } from 'svelte';
        import { dev } from '$app/environment';
        import { page } from '$app/stores';
        import { Button, Alert, Table, Card, CardBody, CardHeader, CardText,
            CardTitle, FormGroup, Input, Row, Col, Container } from 'sveltestrap';

        onMount(async () => {
            getHired('');
        });

        
        let year = $page.params.year;
        let province = $page.params.province;
        let gender = $page.params.gender;
        let API = `/api/v2/hired-people/${year}/${province}/${gender}`;
        
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

        let v_actualizar = false;
        const actualizar = () => (v_actualizar = !v_actualizar);

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
            if(status==404){
                warning = "No existe el dato solicitado.";
                v_warning = true;
                f_warning();
            }else if(status==200){
                info = "Este es el dato solicitado."
                v_info = true;
                f_info();
            }else if(status == 500){
                error = "Ha ocurrido un error en el servidor, vuelva a cargar la página o espere a que solucionemos el problema.";
                v_error = true;
            }	
        }
      
        async function updateHired() {
            console.log(updatedIndefinite_contract+updatedSingle_construction_contract+updatedMultiple_construction_contract+
                updatedSingle_eventual_contract+updatedMultiple_eventual_contract);
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
                    info2 = `El dato ${newYear} ${newProvince} ${newGender} se ha actualizado correctamente.`;
                    v_info2 = true;
                    f_info2();
                }else if(status==404){
                    warning = `El dato ${newYear} ${newProvince} ${newGender} no existe en la base de datos.`;
                    v_warning = true;
                    f_warning();
                }else if(status==400){
                    warning  = `Hay algún dato que no se ha obtenido correctamente, vuelva a intentarlo.`;
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
                <Button on:click={() => {location.replace('/hired-people')}}>Volver atrás</Button>
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
                    <FormGroup floating label="Contratos Indefinidos">
                        <Input
                            type="number"
                            id = "indefinite_contract"
                            name="indefinite_contract"
                            placeholder="Escribe una cifra"
                            bind:value={updatedIndefinite_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Contratos Únicos Construcción" >
                        <Input
                            type="number"
                            id = "single_construction_contract"
                            name="single_construction_contract"
                            placeholder="Escribe una cifra"
                            bind:value={updatedSingle_construction_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Contratos Múltiples Construcción">
                        <Input
                            type="number"
                            id = "multiple_construction_contract"
                            name="multiple_construction_contract"
                            placeholder="Escribe una cifra"
                            bind:value={updatedMultiple_construction_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Contratos Únicos Eventuales">
                        <Input
                            type="number"
                            id = "single_eventual_contract"
                            name="single_eventual_contract"
                            placeholder="Escribe una cifra"
                            bind:value={updatedSingle_eventual_contract}
                        />
                    </FormGroup>
                </Col>
                <Col class = 'mb-3'>
                    <FormGroup floating label="Contratos Múltiples Eventuales">
                        <Input
                            type="number"
                            id = "multiple_eventual_contract"
                            name="multiple_eventual_contract"
                            placeholder="Escribe una cifra"
                            bind:value={updatedMultiple_eventual_contract}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col><Button on:click={updateHired}>Actualizar</Button></Col>
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