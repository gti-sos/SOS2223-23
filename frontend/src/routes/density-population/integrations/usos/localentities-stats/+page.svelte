<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { Button, Table,ButtonToolbar, Input,Container, Row, Col } from 'sveltestrap';

    let loadInitial = "https://sos2223-13.appspot.com/api/v2/localentities/loadInitialData";
    let API = "https://sos2223-13.appspot.com/api/v2/localentities";
    let dataLocalEntities = []

    onMount(async () =>{
        getData();
    });
    async function getData() {
        const initial = await fetch(loadInitial);
        if (initial.ok){
            const res = await fetch(API, {
            method: 'GET'
        });
        try{
            const dataReceived = await res.json();
            dataLocalEntities = dataReceived;
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }	 
          
    }};
</script>
<main>
    <div class="tabla">
        <Table hover>
            <thead>
              <tr>
                <th>Provincia</th>
                <th>Teléfono</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Fecha Nombramiento Presidente</th>
                <th>Extensión</th>
                <th>Poblacion</th>
                <th>Gastos</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
            {#each dataLocalEntities as datos}
              <tr>
                <td>{datos.province}</td>
                <td>{datos.landline}</td>
                <td>{datos.first_name}</td>
                <td>{datos.second_name}</td>
                <td>{datos.president_appointment_date}</td>
                <td>{datos.surface_extension}</td>
                <td>{datos.population}</td>
                <td>{datos.expense}</td>
                <td>{datos.income}</td>
                <td>&nbsp</td>
              </tr>
              {/each} 
            </tbody>
          </Table>
    </div>

    <div class="context">
        <p>Uso de la API de compañero de SOS: 'Localentities'</p>
    </div>
</main>