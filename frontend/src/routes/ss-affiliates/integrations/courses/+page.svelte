<script>
    // @ts-nocheck
    import { Row, Col, Container} from 'sveltestrap';
   
</script>
<main>
    
    <link href="../../node_modules/c3/c3.css" rel="stylesheet">

    <script src="../../node_modules/d3/d3.min.js" charset="utf-8"></script>
    <script src="../../node_modules/c3/c3.min.js"></script>

    <Container>
        <Row>
            <Col sm={{ size: 'auto', offset: 2 }}><h1> Cursos de formación en los últimos años</h1></Col>
        </Row>
    </Container>

    <Container>
        <Row><Col><h3> Gráfica Cursos Ofrecidos Últimos Años</h3></Col></Row>
        <Row><Col><div id="chart" style="width:100%; height:400px;"></div></Col></Row>
    </Container>

    <script>

        generarGrafica();


        async function generarGrafica(){

            let datos = await getCourses();

            let results = getResults(datos);

            let titles = splitTitles(results);

            let counted = countTitles(titles);

            let data = [];

            for (let count of counted){
                data.push([count.title, count.count]);
            }

            var chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: data.slice(0,5),
                    type: 'pie'
                },
                pie: {
                    label: {
                        format: function (value, ratio, id) {
                            return value;
                        }
                    }
                }
            });
        }


        async function getCourses() {


            let currentUrl = window.location.href;
        

            let API = '/api/v2/courses';

            if (currentUrl.includes('localhost')){
                API = 'http://localhost:12345'+API
            }

            let list = [];

            const res = await fetch(`${API}`, {
                method: 'GET'
            });
            try{

                const data = await res.json();
                list = data;
                
            }catch(error){

                console.log(`Error parsing result: ${error}`);
            }
            // @ts-ignore
            const status = await res.status;

            return list

        }

        // Una funcion que tome un objeto con campos {hits, total_hits, schema, results} y devuelva solo el campo results
        function getResults(obj) {
            return obj.results;
        }

        // Una funcion que recibe un array de objetos cada uno con el siguiente schema {"name":"id","type":"str"},{"name":"title","type":"str"},{"name":"course.modality","type":"str"},{"name":"course.start_date","type":"date"},{"name":"course.end_date","type":"date"},{"name":"course.limit_date","type":"date"},{"name":"course.duration","type":"str"},{"name":"course.location","type":"str"},{"name":"course.registration_address","type":"str"},{"name":"course.contact","type":"str"},{"name":"course.mail","type":"str"},{"name":"course.phone","type":"str"}
        // y que separe para cada objeto el campo 'title' usando el caracter + como separador y que devuelva un array con los títulos separados.
        function splitTitles(array) {
            let titles = [];
            array.forEach(element => {
                let title = element.title.split('+');
                title.forEach(tit => {
                    titles.push(tit.trim().replace(/\./g, '').replace(/\,/g, ''));
                })
            });
            return titles;
        }

        // Una funcion que reciba una lista de strings y cuente las ocurrencias de cada uno de ellos y devuelva un objeto con el siguiente schema {"name":"title","type":"str"},{"name":"count","type":"int"}
        function countTitles(array) {
            let titles = [];
            let codigos = [];
            let count = [];
            let result = [];
            array.forEach(element => {
                let codigo = element.split(' ')[0]
                if(codigo.includes('PO')){
                    codigo = codigo.substring(0, 9)
                }
                if (codigos.includes(codigo)) {
                    count[titles.indexOf(element)] += 1;
                } else {
                    titles.push(element);
                    codigos.push(codigo);
                    count.push(1);
                }
            });
            titles.forEach((element, index) => {
                result.push({ title: element, count: count[index]});
            });

            result = result.sort((a,b)=>{
                return b.count - a.count;
            })
            return result;
        }

    </script>


</main>
<style></style>