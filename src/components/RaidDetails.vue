<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../supabase.js';
import { useAuthStore } from '../stores/auth.js';

import NavBar from './NavBar.vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const raidId = route.params.id;

if(!authStore.user || authStore.profile?.tier == null || authStore.profile?.tier === 3){
    router.push('/rejected');
}
</script>

<template>
<NavBar/>
<p> {{ raidId }}</p>
<p>Work in progress!</p>
</template>

<style scoped>
</style>