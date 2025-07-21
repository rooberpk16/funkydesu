<script setup>
import NavBar from './NavBar.vue';
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();


const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');


const handleLoginDiscord = async() => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
    });
    if (error) {
        console.error('Discord login error:', error.message);
    }
}

const handleLogin = async() => {
    loading.value = true;
    try {
        await auth.login(email.value, password.value);
        router.push('/');
    } catch (error){
        errorMsg.value = error.message;
    }

    
    loading.value = false;
};

</script>

<template>
    <NavBar />
    <div class="login-page">
        <h1>Login to Funky Desu</h1>
        <p>Please enter your credentials to access the raid management system.</p>
        <form @submit.prevent="handleLogin">
            <input type="email" placeholder="Email" v-model="email" required />
            <input type="password" placeholder="Password" v-model="password" required />
            <button type="submit" :disabled="loading">
                {{  loading ? 'Logging in... ' : 'Login' }}
            </button>
        </form>

        <p v-if="errorMsg" style="color: red;">
            {{ errorMsg }}
        </p>

        <p>You can log-in with discord too:</p>
        <button @click="handleLoginDiscord">Login with discord</button>
    </div>
</template>

<style scoped>
.login-page {
    padding: 20px;
    text-align: center;
    background-color: #666666; 
    color: lightgrey;
}
.login-page form {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.login-page input {
    margin: 10px 0;
    padding: 10px;
    width: 200px;
    border: none;
    border-radius: 5px;
}
.login-page button {
    padding: 10px 20px;
    background-color: #bc35c9; /* Purple discord-like color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.login-page button:hover {
    background-color: #a11ead;
}
.login-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #bc35c9; /* Purple discord-like color */
    color: white;
    text-decoration: none;
    border-radius: 5px;
}
</style>