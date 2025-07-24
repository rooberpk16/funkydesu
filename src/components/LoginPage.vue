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

const forgotEmail = ref('');
const forgotLoading = ref(false);
const forgotMessage = ref('');
const forgotError = ref('');

const handleForgotPassword = async() => {
    forgotLoading.value = true;
    forgotMessage.value = '';
    forgotError.value = '';

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.value, {
            redirectTo: 'https://funkydesu.vercel.app/reset-password',
        });
        if (error) {
            forgotError.value = error.message;
        } else {
            forgotMessage.value = 'Password reset email sent. Check your inbox.';
        }
    } catch (err){
        forgotError.value = err.message;
    } finally {
        forgotLoading.value = false;
    }
}


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
        <p>You can log-in with discord too:</p>
        <button @click="handleLoginDiscord">Login with discord</button>
        <p>If you forgot your password, enter your email below to receive a reset link:</p>
        <form @submit.prevent="handleForgotPassword">
            <input type="email" placeholder="Email" v-model="forgotEmail" required />
            <button type="submit" :disabled="forgotLoading">
                {{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
        </form>
        <p v-if="forgotMessage" style="color: green;">
            {{ forgotMessage }}
        </p>
        <p v-if="forgotError" style="color: red;">
            {{ forgotError }}
        </p>

        <p v-if="errorMsg" style="color: red;">
            {{ errorMsg }}
        </p>

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
    margin-bottom: 10px;
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