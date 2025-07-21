<script setup>
import NavBar from './NavBar.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { storeToRefs } from 'pinia';

const route = useRoute();
const auth = useAuthStore();
const { user } = storeToRefs(auth);
</script>  

<template>
    
    <NavBar v-if="route.path === '/join'"/>
    
    
    <div class="join-page" v-if="route.path === '/join'">
        <h1>Join our discord server!</h1>
        <p>Click the button below to join our community and participate in raids!</p>
        <a href="https://discord.gg/your-invite-link" class="join-button">Join Now</a>
        <div v-if="!user">
            <p>Already a member of the discord channel? Create an account here:</p>
            <router-link to="/join/register" class="join-button">Register</router-link>
        </div>
    </div>

    <router-view/>
</template>

<style scoped>
.join-page {
    padding: 20px;
    text-align: center;
    background-color: #666666; 
    color: lightgrey;
}
.join-button {
    display: inline-block;
    padding: 10px 20px;
    /*Purple discord-like color*/ 
    background-color: #bc35c9;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}
.join-button:hover {
    background-color: #a11ead;
}
.nav-bar {
    margin-bottom: 20px;
}
</style>