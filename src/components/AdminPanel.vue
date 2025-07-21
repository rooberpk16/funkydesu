<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase.js';
import { useAuthStore } from '../stores/auth.js';
import NavBar from './NavBar.vue';
const authStore = useAuthStore();

const users = ref([]);
const loading = ref(false);
const error = ref('');



const allowedTiers = (user) => {
    const currentTier = authStore.profile?.tier;

    if(currentTier === 0){
        return [0,1,2,3];
    } else if (currentTier === 1){
        if (user.tier === null || user.tier === 2 || user.tier === 3){
            return [2,3];
        } 
    }
    return [];
};

const updateTier = async(user) => {
    if (!user.newTier){
        alert('Please select a tier');
        return;
    }

    const {error: updateError } = await supabase
        .from('profiles')
        .update({tier:user.newTier})
        .eq('id', user.id);

    if (updateError) {
        alert('Error: ${updateError.message}');
        return;
    }

    alert('Tier updated successfully!');
    users.value = await authStore.fetchAllUsers();
};

onMounted(async () => {
    users.value = await authStore.fetchAllUsers();
});
</script>

<template>
<NavBar/>
<p v-if="error" style="color: red">{{ error }}</p>
<p v-if="loading">Loading users...</p>

<table v-if="!loading && users.length">
    <thead>
        <tr>
            <th>Username</th>
            <th>IGN</th>
            <th>Tier</th>
            <th>New Tier</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="u in users" :key="u.id">
            <td>{{ u.username }}</td>
            <td>{{ u.ign }}</td>
            <td>{{ u.tier }}</td>
            <td>
                <select v-model="u.newTier">
                    <option disabled value="">Select Tier</option>
                    <option v-for="tier in allowedTiers(u)" :key="tier" :value="tier">
                        {{ tier }}
                    </option>
                </select>
            </td>
            <td>
                <button @click="updateTier(u)">Save</button>
            </td>
        </tr>
    </tbody>
</table>


</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  border-radius: 6px;
  overflow: hidden;
}

thead {
  background-color: #2c3e50;
  color: white;
  text-align: left;
  user-select: none;
}

thead th {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.95rem;
}

tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.15s ease-in-out;
}

tbody tr:hover {
  background-color: #f0f4f8;
}

tbody td {
  padding: 10px 16px;
  font-size: 0.9rem;
  color: #34495e;
}

select {
  padding: 6px 8px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.2s ease;
}

select:focus {
  border-color: #2980b9;
  outline: none;
}

button {
  padding: 6px 14px;
  font-size: 0.9rem;
  color: white;
  background-color: #2980b9;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

button:hover {
  background-color: #1f618d;
}

p {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 1rem;
  font-size: 1rem;
  color: #e74c3c; /* error color */
}

</style>
