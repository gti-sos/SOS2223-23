
<main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css"/>
  
    <div id="chart" style="width:100%; height:400px;"></div>
    <p>Es un uso de API externa.</p>

    <script>
        
        getData();

        async function getData() {
            let dataWeather = [];
            const APItiempo = 'https://ai-weather-by-meteosource.p.rapidapi.com/daily?lat=37N&lon=36W&language=es&units=ca';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '16ee2bd576msh9cc1a680fac4200p18deefjsn2b38b3ee309e',
                    'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
                }
            };
            const res = await fetch(APItiempo,options, {
                method: 'GET'
            });
            try{
                const datos = await res.json();
                dataWeather = datos.daily.data.map(({day,probability,temperature,wind})=>({day,probability,temperature,wind}))            
            }catch(error){
                console.log(`Error parseando el resultado: ${error}`);
            }
            loadC3Chart(dataWeather);
        };

        async function loadC3Chart(dataWeather){
            let temper = dataWeather.map(n=>n.temperature);
            let lluvia = dataWeather.map(n=>n.probability.precipitation);
            let viento = dataWeather.map(n=>n.wind.speed);
            temper.unshift('Temperatura');
            lluvia.unshift('Probabilidad lluvia')
            viento.unshift('Velocidad viento');
            var chart = c3.generate({
                
                title:{
                    text:"Gráfico que muestra la predicción de temperatura, lluvia y viento que hará en Sierra Nevada desde hoy a dentro de 20 días",
                    style:{
                        'font-weight': 'bold'

                    }
                },
                bindto: '#chart',
                data: {
                    columns: [
                        temper,
                        lluvia,
                        viento,
                        
                    ]
                },
                tooltip: {
                    format: {
                        value: function (value,ratio, id) {
                            var format = "";
                            if (id==='Temperatura'){
                                format = d3.format('.1f')(value) + 'ºC';
                            }else if(id==="Probabilidad lluvia"){
                                format = d3.format('.0%')(value/100);
                            }else{
                                format = d3.format('.1f')(value) + ' km/h';
                            }
                            return format;
                        }
                    }
                }
                ,
                axis: {
                    
                    x: {
                        type: 'category',
                        categories: dataWeather.map(n=>n.day)
                    }
                }
                
            });
        }
    </script>
</main>
