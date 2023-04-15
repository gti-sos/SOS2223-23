<script>
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
</script>

<main>
    <Header/>
    <slot></slot>
    <Footer/>
</main>

<style>
    main {
        position: relative;
        min-height: 100%;
        color: #002366;
        font-family: 'Times New Roman', Arial, sans-serif;
    }
   
</style>