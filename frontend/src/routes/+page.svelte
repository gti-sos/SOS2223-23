<script>
    import { dev } from '$app/environment';
    let API = '/api/v1';
    if (dev)
        API = 'http://localhost:12345'+API;

</script>
<main>
    <br>
    <h1 style="padding-left: 10px;">SOS2223-23</h1>
    <ul>
        <li><b>Equipo:</b></li>
        <br>
        <ul>
            <li><a href="https://github.com/ricardovrodri">Ricardo Vaz Rodriguez</a> Fuente de datos: <a href="https://www.juntadeandalucia.es/institutodeestadisticaycartografia/afiliadosSS/">ss-affiliates</a></li>
            <li><a href="https://github.com/PabPerOrt1">Pablo Antonio Perez Ortega</a> Fuente de datos: <a href="https://www.juntadeandalucia.es/institutodeestadisticaycartografia/badea/operaciones/consulta/anual/50257?CodOper=b3_1094&codConsulta=50257">density-population</a></li>
            <li><a href="https://github.com/agujimcas">Agustín Manuel Jiménez Casas</a> Fuente de datos: <a href="https://www.juntadeandalucia.es/institutodeestadisticaycartografia/badea/operaciones/consulta/anual/42083?CodOper=b3_2594&codConsulta=42083">hired-people</a></li>
        </ul>
        <br>
        <br>
        <li><dl>
            <dt><b>Descripción del proyecto:</b></dt>
            <br>
            <di>Our sources of information are aimed at analyzing the interconnection in the data between Spanish <br>
                people hired in Andalusia according to province, type of contract and sex, population density and labor rates <br>
                of affiliation to social security, new contracts and according to type. </di>
        </dl></li>
        <br>
        <br>
        <li><b>Repositorio de GitHub: </b><a href="https://github.com/gti-sos/SOS2223-23">gti-sos/SOS2223-23</a></li>
        <br>
        <br>
        <li><b>Enlaces a las APIs: </b></li>
        <br>
        <ul>
            <li><a href="{API}/ss-affiliates">Ss-affiliates</a> (developed by Ricardo Vaz Rodriguez)</li>
            <li><a href="{API}/density-population">Density-population</a> (developed by Pablo Antonio Perez Ortega)</li>
            <li><a href="{API}/hired-people">Hired-people</a> (developed by Agustín Manuel Jiménez Casas)</li>
        </ul>
        <br>
        <br>
        <li><b>Documentacion de las APIS:</b></li>
        <br>
        <ul>
            <li><a href="{API}/ss-affiliates/docs">Documentacion ss-affiliates</a> (developed by Ricardo Vaz Rodriguez)</li>
            <li><a href="{API}/density-population/docs">Documentacion density-population</a> (developed by Pablo Antonio Perez Ortega)</li>
            <li><a href="{API}/hired-people/docs">Documentacion hired-people</a> (developed by Agustín Manuel Jiménez Casas)</li>
        </ul>
        <br>
        <li><b>Frontends de las APIS:</b></li>
        <br>
        <ul>
            <li><a href="/ss-affiliates">Frontend de ss-affiiates</a> (developed by Ricardo Vaz Rodriguez)</li>
            <li><a href="/density-population">Frontend de density-population</a> (developed by Pablo Antonio Perez Ortega)</li>
            <li><a href="/hired-people">Frontend de hired-people</a> (developed by Agustín Manuel Jiménez Casas)</li>
        </ul>
    </ul>
    <br>
    <br>
</main>
