<script setup>
    import NavBar from './NavBar.vue';
    import { ref } from 'vue';
    import { supabase } from '../supabase.js';

    /*const username = ref('');
    const ign = ref('');*/
    const email = ref('');
    const password = ref('');
    const redirectURL = 'http://localhost:5173/login'; // Replace with your actual redirect URL

    const handleRegister = async() => {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                emailRedirectTo: redirectURL,
            }
        });

        if (error) {
            console.error('Error registering:', error);
            alert('Error registering: ' + error.message);
        } else {
            console.log('Registration successful:', data);
            alert('Registration successful! Please check your email for confirmation.');
            // Optionally redirect to login page or home page
            // window.location.href = '/login';
        }
    };
</script>

<template>
    <NavBar />
    <div class="register-page">
        <h1>Register for Funky Desu</h1>
        <p>Please fill in the form below to create an account.</p>
        <form @submit.prevent="handleRegister">
            <input type="email" placeholder="Email" v-model="email" required />
            <input type="password" placeholder="Password" v-model="password" required />
            <button type="submit">Register</button>
        </form>
        <p>Register with discord here: </p>
        <a href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=identify" class="register-button">Register with Discord</a>
        <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
</template>

<style scoped>
.register-page {
    padding: 20px;
    text-align: center;
    background-color: #666666; 
    color: lightgrey;
}
.register-page form {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.register-page input {
    margin: 10px 0;
    padding: 10px;
    width: 200px;
    border: none;
    border-radius: 5px;
}
.register-page button {
    padding: 10px 20px;
    background-color: #bc35c9; /* Purple discord-like color */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.register-page button:hover {
    background-color: #a11ead;
}
.register-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #bc35c9; /* Purple discord-like color */
    color: white;
    text-decoration: none;
    border-radius: 5px;
}
.register-button:hover {
    background-color: #a11ead;
}
.register-page p {
    margin-top: 20px;
}
.register-page a {
    color: #ffffff; /* Purple discord-like color */
    text-decoration: none;
}
.register-page a:hover {
    text-decoration: underline;
}
.register-page h1 {
    margin-bottom: 20px;
}
.register-page p {
    margin-bottom: 20px;
}
.register-page form {
    margin-bottom: 20px;
}
.register-page form input {
    margin-bottom: 10px;
}
.register-page form button {
    margin-top: 10px;
}
.register-page form p {
    margin-top: 10px;
}
.register-page form a {
    color: #bc35c9; /* Purple discord-like color */
    text-decoration: none;
}
.register-page form a:hover {
    text-decoration: underline;
}
.register-page h1 {
    margin-bottom: 20px;
}
.register-page p {
    margin-bottom: 20px;
}
.register-page form {
    margin-bottom: 20px;
}
.register-page form input {
    margin-bottom: 10px;
}
.register-page form button {
    margin-top: 10px;
}
.register-page form p {
    margin-top: 10px;
}
.register-page form a {
    color: #bc35c9; /* Purple discord-like color */
    text-decoration: none;
}
.register-page form a:hover {
    text-decoration: underline;
}

</style>