<script setup>
import { ref, computed } from 'vue';
import { supabase } from '../supabase.js';
import { useAuthStore } from '../stores/auth.js';
import { useRouter } from 'vue-router';

import NavBar from './NavBar.vue';

const authStore = useAuthStore();
const router = useRouter();

if(!authStore.user || authStore.profile?.tier == null || authStore.profile?.tier === 3){
    router.push('/rejected');
}

const raidName = ref('');
const preset = ref('');
const allowDup = ref(false);
const datetime = ref('');
const config = ref({});



const presets = [
    'Personalized',
    '4-Man Duty',
    '4-Man Duty Unrestricted',
    '8-Man Raid/Trial',
    '8-Man Duty Unrestricted',
    'Alliance/Chaotic Raid',
    'Alliance Unrestricted',
    'Field Ops',
    'Field Ops Unrestricted',
];

const updateConfig = () => {
    if (preset.value === 'Personalized'){
        config.value = {
            parties: 1,
            players: 1,
            tanks: 0,
            healers: 0,
            dps: 0,
            free: false,
        }
    } else if (preset.value === '4-Man Duty'){
        config.value = {
            parties: 1,
            players: 4,
            tanks: 1,
            healers: 1,
            dps: 2,
            free:false,
        }
    } else if (preset.value === '4-Man Duty Unrestricted'){
        config.value = {
            parties: 1,
            players: 4,
            free: true,
        }
    } else if (preset.value === '8-Man Raid/Trial') {
        config.value = {
            parties: 1,
            players: 8,
            tanks: 2,
            healers: 2,
            dps: 4,
            dpslim: false,
            free: false,
        }
    } else if (preset.value === '8-Man Duty Unrestricted'){
        config.value = {
            parties: 1,
            players: 8,
            free: true,
        }
    } else if (preset.value === 'Alliance/Chaotic Raid'){
        config.value = {
            parties: 3,
            players: 24,
            perParty: {
                tanks: 1,
                healers: 2,
                dps: 5,
            },
            free: false,
        }
    } else if (preset.value === 'Alliance Unrestricted'){
        config.value = {
            parties: 3,
            players: 24,
            free: true,
        }
    } else if (preset.value === 'Field Ops') {
        config.value = {
            parties: 6,
            players: 48,
            perParty: {
                tanks: 1,
                healers: 2,
                dps: 5,
            },
            free: false,
        }
    } else if (preset.value === 'Field Ops Unrestricted') {
        config.value = {
            parties: 6,
            players: 48,
            free: true,
        }
    } else {
        config.value = {};
    }
};

const createRaid = async() => {
    if (!raidName.value || !datetime.value || !config.value){
        alert('Please fill in all fields.' + raidName.value + ' ' + datetime.value + ' ' + JSON.stringify(config.value));
        return;
    }

    const localDate = new Date(datetime.value).toISOString();
    //const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

    const { error } = await supabase
        .from('raids')
        .insert({
            owner_id: authStore.user.id,
            raid_name: raidName.value,
            preset: preset.value,
            allow_dup: allowDup.value,
            datetime: localDate,
            config: config.value,
            owner_ign: authStore.profile.ign,
        });
    if (error) {
        alert('Error creating raid: ' + error.message);
        return;
    } else {
        alert('Raid created successfully!');
        router.push('/raids');
    }
}

</script>

<template>
<NavBar/>
<div class="create-raid" v-if="authStore.profile?.tier < 3">
    <h2>Create a Raid Announcement</h2>
    
    <form @submit.prevent="createRaid">
        <div class="form-group">
            <label for="raidName">Raid Name:</label>
            <input type="text" id="raidName" v-model="raidName" required/>
        </div>

        <div class="form-group">
            <label for="preset">Preset:</label>
            <select v-model="preset" id="preset" @change="updateConfig" required>
                <option disabled value="">Select a preset</option>
                <option v-for="p in presets" :key="p">{{ p }}</option>                
            </select>
        </div>
        
        <!--Each preset has a different div (holy sh*t)-->
        <div v-if="preset === 'Personalized'" class="form-group personalized">
            <label for="alliances">Number of alliances</label>
            <input v-model.number="config.parties" type="number" id="alliances" max="6" min="1" required>
            <label for="players">Number of total players: </label>
            <input v-model.number="config.players" type="number" id="players" max="48" min="1"  required>
            <label for="free">Assign roles?</label>
            <input v-model="config.free" type="checkbox" id="free">
            <div v-if="config.free" class="form-group tanks">
                <label for="tanks">Tanks</label>
                <input v-model.number="config.tanks" type="number" id="tanks">
            </div>
            <div v-if="config.free" class="form-group healers">
                <label for="healers">Healers</label>
                <input v-model.number="config.healers" type="number" id="healers">
            </div>
            <div v-if="config.free" class="form-group dps">
                <label for="dps">DPS</label>
                <input v-model.number="config.dps" type="number" id="dps">
            </div>
        </div>

        <div v-if="preset === '4-Man Duty'" class="form-group 4-man-duty">
            <p>Players: {{ config.players }}</p>
            <p>Tanks: {{ config.tanks }}</p>
            <p>Healers: {{ config.healers }}</p>
            <p>DPS: {{ config.dps }}</p>
        </div>

        <div v-if="preset == '4-Man Duty Unrestricted' " class="form-group 4-man-un">
            <p>Players: {{ config.players }}</p>
            <p>No restriction for roles</p>
        </div>

        <div v-if="preset === '8-Man Raid/Trial'" class="form-group 8-man-duty">
            <p>Players: {{ config.players }}</p>
            <p>Tanks: {{ config.tanks }}</p>
            <p>Healers: {{ config.healers }}</p>
            <p>DPS: {{ config.dps }}</p>
            <label for="dps-lim">Limit DPS to 2 melee, 1 ranged, 1 caster?</label>
            <input v-model="config.dpslim" type="checkbox" id="dps-lim">
        </div>

        <div v-if="preset === '8-Man Duty Unrestricted'" class="form-group 8-man-un">
            <p>Players: {{ config.players }}</p>
            <p>No restriction for roles</p>
        </div>

        <div v-if="preset === 'Alliance/Chaotic Raid'" class="form-group alli-chaos">
            <p>Alliances: {{ config.parties }}</p>
            <p>Players: {{ config.players }}</p>
            <p>Tanks per alliance: {{ config.perParty.tanks }}</p>
            <p>Healers per alliance: {{ config.perParty.healers }}</p>
            <p>DPS per alliance: {{ config.perParty.dps }}</p>
        </div>

        <div v-if="preset === 'Alliance Unrestricted'" class="form-group alli-un">
            <p>Alliances: {{ config.parties }}</p>
            <p>Players: {{ config.players }}</p>
            <p>No restriction for roles on any alliance</p>
        </div>

        <div v-if="preset === 'Field Ops'" class="form-group fieldops">
            <p>Alliances: {{ config.parties }}</p>
            <p>Players: {{ config.players }}</p>
            <p>Tanks per alliance: {{ config.perParty.tanks }}</p>
            <p>Healers per alliance: {{ config.perParty.healers }}</p>
            <p>DPS per alliance: {{ config.perParty.dps }}</p>
        </div>

        <div v-if="preset === 'Field Ops Unrestricted'" class="form-group fieldops-un">
            <p>Alliances: {{ config.parties }}</p>
            <p>Players: {{ config.players }}</p>
            <p>No restriction for roles on any alliance</p>
        </div>

        <div class="form-group">
            <label for="allowDup">Allow Duplicate Classes?</label>
            <input v-model="allowDup" type="checkbox"  id="allowDup">
        </div>
        <div class="form-group">
            <label for="date">Introduce the date and hour of the raid:</label>
            <input v-model="datetime" type="datetime-local" id="date" required>
        </div>
        <div class="form-button">
            <button type="submit">Create Raid</button>
        </div>
    </form>

</div>
<div class="create-raid-rejected" v-else>
    <h2>You don't have permission to create raids.</h2>
    <p>Contact with an admin if you think you should have access.</p>
</div>
</template>

<style scoped>
    .create-raid-rejected {
        color:white;
    }

    .create-raid {
        display:flex;
        align-items: center;
        flex-direction: column;
    }
    h2 {
        color:white;
        text-align:center;
    }
    .form-group {
        text-align:center;
        color:white;
        padding:10px;
        margin:1rem;
        border: 2px solid white;
        border-radius: 10px;
    }
    input, select {
        margin-left:1rem;
        margin-right:1rem;
    }

    .form-button {
        display:flex;
        justify-content:center;
    }

    #allowDup {
        width: 1rem;
        height: 1rem;
    }
    
    button {
    display: inline-block;
    padding: 10px 20px;
    /*Purple discord-like color*/ 
    background-color: #bc35c9;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    border:none;
    }

    button:hover {
        background-color: #a11ead;
        cursor:pointer;
    }
    
</style>