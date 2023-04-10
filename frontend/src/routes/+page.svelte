<script>
    import { dev } from '$app/environment';
    let API_v2 = '/api/v2';
    let API_v1 = '/api/v1';
    if (dev)
        API_v2 = 'http://localhost:12345'+API_v2;
        API_v1 = 'http://localhost:12345'+API_v1;

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
            <di>Nuestras fuentes de informacion estan orientadas a analizar la interconexion en los datos entre las <br>
                personas españolas contratadas en Andalucia según provincia, tipologia de contratos y sexo, la densidad de poblacion <br>
                y los indices laborales de afiliacion a la seguridad social, nuevos contratos y según tipo. </di>
        </dl></li>
        <br>
        <br>
        <li><b>Repositorio de GitHub: </b><a href="https://github.com/gti-sos/SOS2223-23">gti-sos/SOS2223-23</a></li>
        <br>
        <br>
        <li><b>Enlaces a las APIs: </b></li>
        <br>
        <ul>
            <li><a href="{API_v2}/ss-affiliates">Ss-affiliates</a> (Realizado por Ricardo Vaz Rodriguez)</li>
            <li><a href="{API_v2}/density-population">Density-population</a> (Realizado por Pablo Antonio Perez Ortega)</li>
            <li><a href="{API_v2}/hired-people">Hired-people</a> (Realizado por Agustín Manuel Jiménez Casas)</li>
        </ul>
        <br>
        <br>
        <li><b>Documentacion de las APIS v2:</b></li>
        <br>
        <ul>
            <li><a href="{API_v2}/ss-affiliates/docs">Documentacion ss-affiliates</a> (Realizado por Ricardo Vaz Rodriguez)</li>
            <li><a href="{API_v2}/density-population/docs">Documentacion density-population</a> (Realizado por Pablo Antonio Perez Ortega)</li>
            <li><a href="{API_v2}/hired-people/docs">Documentacion hired-people</a> (Realizado por Agustín Manuel Jiménez Casas)</li>
        </ul>
        <br>
        <br>
        <li><b>Documentacion de las APIS v1:</b></li>
        <br>
        <ul>
            <li><a href="{API_v1}/ss-affiliates/docs">Documentacion ss-affiliates</a> (Realizado por Ricardo Vaz Rodriguez)</li>
            <li><a href="{API_v1}/density-population/docs">Documentacion density-population</a> (Realizado por Pablo Antonio Perez Ortega)</li>
            <li><a href="{API_v1}/hired-people/docs">Documentacion hired-people</a> (Realizado por Agustín Manuel Jiménez Casas)</li>
        </ul>
        <br>
        <li><b>Frontends de las APIS:</b></li>
        <br>
        <ul>
            <li><a href="/ss-affiliates">Frontend de ss-affiiates</a> (Realizado por Ricardo Vaz Rodriguez)</li>
            <li><a href="/density-population">Frontend de density-population</a> (Realizado por Pablo Antonio Perez Ortega)</li>
            <li><a href="/hired-people">Frontend de hired-people</a> (Realizado por Agustín Manuel Jiménez Casas)</li>
        </ul>
    </ul>
    <br>
    <br>
</main>
