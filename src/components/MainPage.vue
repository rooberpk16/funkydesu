<script setup>
import NavBar from './NavBar.vue';
</script>


<template>
    <NavBar />
    <div class="main-page">
        <h1>Welcome to the Funky Desu webpage!</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
        <p>Use the navigation bar above to explore the site.</p>
    </div>
</template>


<style scoped>
    .nav-bar {
        margin-bottom: 20px;
    }

    .main-page {
        padding: 20px;
        text-align: center;
        background-color: #666666; 
        color: lightgrey;
    }


</style>