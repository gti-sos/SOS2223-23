<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    let dataToro=[];
    let API = "https://datos.juntadeandalucia.es/api/v0/places/option-values/place_provinces";
    //https://www.juntadeandalucia.es/datosabiertos/portal/dataset?res_format=openapi-json&vocab_field_activity_sector=Cultura+y+ocio

    onMount(async () =>{
        getData();
    });

    async function getData() {
        const res = await fetch(API, {
            method: 'GET'
        });
        try{
            const dataReceived = await res.json();
            console.log(dataReceived)
            dataToro = dataReceived;
            console.log(dataToro)
        }catch(error){
            console.log(`Error parseando el resultado: ${error}`);
        }	   
    };

   
</script>