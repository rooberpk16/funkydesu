<script setup>
import { useAuthStore } from '../stores/auth.js';
import { storeToRefs } from 'pinia';
import { useRouter} from 'vue-router';

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const router = useRouter();

const handleLogout = async() => {
    await auth.logout();
    router.push('/');
};
</script>


<template>
    <!--Nav bar for the whole website. Must include a 
    Home button, Join button, a Login button, a Create button and a Raids button-->
    <nav class="navbar">
        <div class="navbar-div">

            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/join">Join</a></li>
                <li><a href="/create">Create</a></li>
                <li><a href="/raids">Raids</a></li>
                <li></li>
                <li v-if="!user"><a href="/login">Login</a></li>
                <li v-else><button @click="handleLogout">Logout</button></li>
                <li v-if="auth.profile?.tier === 0 || auth.profile?.tier === 1">
                    <a href="/admin">Admin panel</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style>
.navbar {
    background-color: #333;
    overflow: hidden;
}
.navbar-div{
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content: center;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
ul li {
    float: left;
}
ul li a, ul li button {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
}
ul li a:hover, ul li button:hover {
    background-color: #111;
}

</style>