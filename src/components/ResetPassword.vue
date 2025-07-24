<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase.js';
import NavBar from './NavBar.vue';

const router = useRouter();
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const error = ref('');

const handleResetPassword = async() => {
    if (newPassword.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        return;
    }

    try {
        const { data, error: updateError } = await supabase
            .auth.updateUser({
                password: newPassword.value,
            });

        if (updateError) {
            error.value = updateError.message;
        } else {
            message.value = 'Password successfully updated. Redirecting to login...';
            setTimeout(() => {
                router.push('login');
            }, 2000);
        } 
    } catch (err) {
        error.value = err.message;
    }
};

onMounted(async() => {
    const { data, error: sessionError } = await supabase
        .auth.getSession();
    if(sessionError || !data.session) {
        error.value = 'Invalid or expired reset link. Please request a new reset link.';
    }
});

</script>

<template>
    <NavBar/>
    <div class="reset-password-page">
        <h1>Reset your password</h1>
        <p v-if="message" style="color:white;">{{ message }}</p>
        <p v-if="error" style="color:red;">{{ error }}</p>
        <form @submit.prevent="handleResetPassword">
            <input 
                type="password"
                placeholder="New Password"
                v-model="newPassword"
                required
            />
            <input 
                type="password"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    </div>

</template>

<style scoped>
.reset-password-page {
    padding:20px;
    text-align: center;
    background-color: #666666;
    color:lightgrey;
}
.reset-password-page form {
    display:flex;
    flex-direction:column;
    align-items:center;
}
.reset-password-page input {
    margin: 10px 0;
    padding: 10px;
    width: 200px;
    border: none;
    border-radius: 5px;
}
.reset-password-page button {
    padding:10px 20px;
    background-color: #bc35c9;
    color:white;
    border:none;
    border-radius: 5px;
    cursor:pointer;
}
.reset-password-page button:hover {
    background-color: #a11ead;
}
</style>