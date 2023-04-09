<script>
    import { dev } from '$app/environment';
    import {
    Nav,
    NavItem,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    NavLink
  } from 'sveltestrap';

  let API = '/api/v1';
    if (dev)
        API = 'http://localhost:12345'+API;

</script>

<main>
    <Nav tabs>
        <NavLink href="/">Inicio</NavLink>
        <Dropdown nav autoClose={true}>
            <DropdownToggle nav class="nav-link" caret>APIS</DropdownToggle>
            <DropdownMenu>
                <DropdownItem href = "{API}/ss-affiliates">ss-affiliates (Ricardo)</DropdownItem>
                <DropdownItem href = "{API}/hired-people">hired-people (Agustín)</DropdownItem>
                <DropdownItem href = "{API}/density-population">density-people (Pablo)</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Dropdown nav autoClose={true}>
            <DropdownToggle nav class="nav-link" caret>Perfiles de GitHub</DropdownToggle>
            <DropdownMenu>
                <DropdownItem href = "https://github.com/ricardovrodri">ricardovrodri</DropdownItem>
                <DropdownItem href = "https://github.com/PabPerOrt1">PabPerOrt1</DropdownItem>
                <DropdownItem href = "https://github.com/agujimcas">agujimcas</DropdownItem>
                <DropdownItem href = "https://github.com/gti-sos/SOS2223-23">SOS2223-23</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Dropdown nav autoClose={true}>
            <DropdownToggle nav class="nav-link" caret>Frontends</DropdownToggle>
            <DropdownMenu>
                <DropdownItem href = "/ss-affiliates">ss-affiliates (Ricardo)</DropdownItem>
                <DropdownItem href = "/hired-people">hired-people (Agustín)</DropdownItem>
                <DropdownItem href = "/density-population">density-people (Pablo)</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Dropdown nav autoClose={true}>
            <DropdownToggle nav class="nav-link" caret>Documentaciones</DropdownToggle>
            <DropdownMenu>
                <DropdownItem href = "{API}/ss-affiliates/docs">ss-affiliates (Ricardo)</DropdownItem>
                <DropdownItem href = "{API}/hired-people/docs">hired-people (Agustín)</DropdownItem>
                <DropdownItem href = "{API}/density-population/docs">density-people (Pablo)</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </Nav>
</main>