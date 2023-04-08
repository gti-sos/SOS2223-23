<script>
    import {
    Nav,
    NavItem,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    NavLink
  } from 'sveltestrap';


</script>

<main>
    <Nav tabs>
        <NavLink href="/">Inicio</NavLink>
        <Dropdown nav autoClose={true}>
            <DropdownToggle nav class="nav-link" caret>APIS</DropdownToggle>
            <DropdownMenu>
                <DropdownItem href = "https://sos2223-23.ew.r.appspot.com/api/v1/ss-affiliates">ss-affiliates (Ricardo)</DropdownItem>
                <DropdownItem href = "https://sos2223-23.ew.r.appspot.com/api/v1/hired-people">hired-people (Agustín)</DropdownItem>
                <DropdownItem href = "htps://sos2223-23.ew.r.appspot.com/api/v1/density-population">density-people (Pablo)</DropdownItem>
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
    </Nav>
</main>