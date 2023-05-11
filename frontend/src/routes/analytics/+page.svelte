<svelte:head>

</svelte:head>
<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res, ms));
    let dataPPO=[];
    let dataRVR=[];
    let dataAMJC=[];
    let APIppo = "https://sos2223-23.appspot.com/api/v2/density-population";
    let APIrvr= "https://sos2223-23.appspot.com/api/v2/ss-affiliates";
    let APIamjc = "https://sos2223-23.appspot.com/api/v2/hired-people";

    onMount(async ()=>{
        getData();
    });

    async function getData(){
        const loadDatappo = await fetch(APIppo+"/loadInitialData");
        const loadDatrvr = await fetch(APIrvr+"/loadInitialData");
        const loadDatamjc = await fetch(APIamjc+"/loadInitialData");
        if(loadDatappo.ok && loadDatrvr.ok && loadDatamjc.ok){
            const resPpo = await fetch(APIppo, {
            method: 'GET'
            });
            try{
                const dataP = await resPpo.json();
                let dataPmayus= dataP.filter(n=>n.province!=='Andalucía')
                .map(n=> ({...n, province: n.province.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}))
                .map(({year,province,gender,capital_size})=>({year,province,gender,capital_size}))
                .reduce((acc, b) => {
                    let key = b.year + b.province;
                    let existingObj = acc.find((obj) => obj.key === key);
                    if (existingObj) {
                        existingObj.capital_size_total += b.capital_size;
                        existingObj.numOccurrences += 1;
                    } else {
                        acc.push({
                        key: key,
                        year: b.year,
                        province: b.province,
                        capital_size_total: b.capital_size,
                        numOccurrences: 1
                        });
                    }
                    return acc;
                    }, [])
                    .map(obj => {
                    obj.capital_size = obj.capital_size_total / obj.numOccurrences;
                    delete obj.key;
                    delete obj.capital_size_total;
                    delete obj.numOccurrences;
                    return obj;
                });
                
                dataPPO=dataPmayus;

            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);

            }
            //Indefi
            const resRvr = await fetch(APIrvr, {
            method: 'GET'
            });
            try{
                const dataR = await resRvr.json();
                let dataRfiltrada=dataR.map(({year,province,n_cont_indef})=>({year,province,n_cont_indef}));
                dataRVR=dataRfiltrada;

            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);

            }
            //single-construct
            const resAmjc = await fetch(APIamjc, {
            method: 'GET'
            });
            try{
                const dataA = await resAmjc.json();
                let dataAmayus= dataA.map(n=> ({...n, province: n.province.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}))
                .map(({year,province,gender,single_construction_contract})=>({year,province,gender,single_construction_contract}))
                .reduce((acc, b) => {
                    let key = b.year + b.province;
                    let existingObj = acc.find((obj) => obj.key === key);
                    if (existingObj) {
                        existingObj.single_construction_contract_total += b.single_construction_contract;
                        existingObj.numOccurrences += 1;
                    } else {
                        acc.push({
                        key: key,
                        year: b.year,
                        province: b.province,
                        single_construction_contract_total: b.single_construction_contract,
                        numOccurrences: 1
                        });
                    }
                    return acc;
                    }, []).map(obj => {
                    delete obj.key;
                    delete obj.numOccurrences;
                    return obj;
                });
                dataAMJC = dataAmayus;

            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);

            }
        }
        await delay(500);
        loadChart();

    }

    async function loadChart(){
        console.log(dataPPO);
        console.log(dataRVR);
        console.log(dataAMJC);

    }
</script>