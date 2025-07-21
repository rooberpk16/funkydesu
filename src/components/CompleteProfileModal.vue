<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { useAuthStore } from '../stores/auth.js';
import { watch } from 'vue';

const props = defineProps({
    show: Boolean,
    onClose: Function,
});

const authStore = useAuthStore();

const username = ref('');
const ign = ref('');
const error = ref('');

watch(() => props.show, (newVal) => {
    if (newVal) {
        username.value = '';
        ign.value = '';
        error.value = '';
    }
});

const saveProfile = async () => {
    if (!username.value || !ign.value){
        error.value = 'Please fill in all fields.';
        return;
    }

    const { error: updateError } = await authStore.updateProfile(username.value, ign.value);


    if (updateError) {
        error.value = updateError.message;
        return;
    }

    props.onClose();
};


</script>

<template>
    <div v-if="show" class="modal-backdrop">
        <div class="modal">
            <h2>Complete your profile</h2>
            <p>To continue, please fill in your Username for this page and your In-Game Name</p>
            <input type="text" v-model="username" placeholder="Username"/>
            <input type="text" v-model="ign" placeholder="In-Game Name"/>
            <p v-if="error" class="error">{{ error }}</p>
            <button @click="saveProfile">Save data</button>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position:fixed;
    top: 0; left: 0;
    width:100%; height:100%;
    background: rgba(0, 0, 0, 0.7);
    display:flex;
    align-items:center;justify-content: center;
    z-index: 1000;
}

.modal {
    background: #333;
    color:white;
    padding: 20px;
    border-radius: 10px;
    width:300px;
    text-align:center;
}
.modal input {
    margin:10px 0;
    padding: 8px;
    width:90%;
    border-radius: 5px;
    border:none;
}
.modal button {
    padding: 8px 16px;
    background-color: #bc35c9;
    color: white;
    border:none;
    border-radius:5px;
    cursor:pointer;
}
.modal button:hover {
    background-color: #a11ead;
}
.error{
    color:#ff7777;
    margin-top:10px;
}
</style>