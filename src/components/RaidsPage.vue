<script setup>
import { supabase } from '../supabase.js';
import { useAuthStore } from '../stores/auth.js';
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from './NavBar.vue';
import { useRouter } from 'vue-router';




const authStore = useAuthStore();
const router = useRouter();

const raids = ref([]);
const participantsCount = ref({});
const participantsCountRoles = ref({});
const dateLocal = ref({});

const jobToRole = {
    "Warrior": "tank",
    "Paladin": "tank",
    "Dark Knight": "tank",
    "Gunbreaker": "tank",

    "Scholar": "healer",
    "Sage": "healer",
    "White Mage": "healer",
    "Astrologian": "healer",

    "Monk": "dps",
    "Reaper": "dps",
    "Dragoon": "dps",
    "Samurai": "dps",
    "Ninja": "dps",
    "Viper": "dps",

    "Machinist": "dps",
    "Bard": "dps",
    "Dancer": "dps",

    "Black Mage": "dps",
    "Red Mage": "dps",
    "Pictomancer": "dps",
    "Summoner": "dps",
};

if(!authStore.user || authStore.profile?.tier == null || authStore.profile?.tier === 3){
    router.push('/rejected');
    return;
}

const joinRaid = async(raid) => {
    const selectedJob = Variable; //Check later when template is done;
    const computedRole = jobToRole[selectedJob];

    // get data from participants
    const { data: participants, error } = await supabase
        .from('profileraids')
        .select('role, user_id')
        .eq('raid_id', raid.id);

    if (error) {
        alert('Error fetching participants' + error.message);
        return;
    }

    for(p of participants) {
        if (p.user_id === authStore.user.id) {
            alert('You are already participating in this raid');
            return;
        }
    }

    const totalParticipants = participants.length;
    const roleCount = participants.filter(p => p.role === computedRole)

    let finalRole = computedRole;
    if(raid.config.free){
        if(totalParticipants >= raid.config.players){
            finalRole = 'bench';
        }
    } else {
        if (totalParticipants >= raid.config.players) {
            finalRole = 'bench';
        } else if (
            (computedRole === 'tank' && roleCount >= raid.config.tanks) ||
            (computedRole === 'healer' && roleCount >= raid.config.healers) ||
            (computedRole === 'dps' && roleCount >= raid.config.dps)
        ) {
            finalRole = 'bench';
        }
    }

    const { error: insertError } = await supabase
        .from('profileraids')
        .insert({
            raid_id: raid.id,
            user_id: authStore.user.id,
            user_ign: authStore.profile.ign,
            job: selectedJob,
            role: finalRole,
        });
    
    if(insertError) {
        alert('Error joining raid: ' + insertError.message);
    } else {
        alert('Joined raid as ' + finalRole ==='bench' ? 'Bench (no slots available)' : finalRole);
    }
};

onMounted( async() => {
    const { data: raidsData } = await supabase.from('raids').select('*');
    raids.value = raidsData;

    //alert(JSON.stringify(raidsData));
    for (const raid of raidsData) {
        const { count } = await supabase
            .from('profileraids')
            .select('*', {count: 'exact', head: true})
            .eq('raid_id', raid.id);
        participantsCount.value[raid.id] = count;
        if (!raid.config.free){
            const { data: countRole } = await supabase
                .from('profileraids')
                .select('role')
                .eq('raid_id', raid.id);
            let cDPS = 0;
            let cHealers = 0;
            let cTanks = 0;
            for (const role of countRole) {
                if (role.role === "tank"){
                    cTanks++;
                } else if(role.role==="healer"){
                    cHealers++;
                } else if(role.role==="dps"){
                    cDPS++;
                }
            }
            participantsCountRoles.value[raid.id] = {tanks: cTanks, healers: cHealers, dps: cDPS}
            //alert(participantsCountRoles.value[raid.id].tanks)
            
        }
        dateLocal.value[raid.id] = new Date(raid.datetime).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    //channel to listen for updates on raids
    const channel = supabase
        .channel('profileraids changes')
        .on('postgres_changes', {event: '*', schema: 'public', table: 'profileraids'}, async (payload) => {
            const raidId = payload.new ? payload.new.raid_id : payload.old.raid_id;
            
            if(raidId === undefined) return;
            
            const { count } = await supabase
                .from('profileraids')
                .select('*', {count: 'exact', head: true})
                .eq('raid_id', raidId);
            participantsCount.value[raidId] = count;
            const { data: countRole, error } = await supabase
                .from('profileraids')
                .select('role')
                .eq('raid_id', raidId);

            if(error) alert(error.message);
            let cDPS = 0;
            let cHealers = 0;
            let cTanks = 0;
            for (const role of countRole) {
                if (role.role === "tank"){
                    console.log("TANK")
                    cTanks++;
                } else if(role.role==="healer"){
                    cHealers++;
                } else if(role.role==="dps"){
                    cDPS++;
                }
            }
            participantsCountRoles.value[raidId] = {tanks: cTanks, healers: cHealers, dps: cDPS}
            
        })
        .subscribe();

        onUnmounted(() => {
            supabase.removeChannel(channel);
        });
});
</script>

<template>
    <NavBar/>
    <div class="container">
        <div class="raids">
            <div class="raid" v-for="raid in raids" :key="raid.id">
                <p>{{ raid.raid_name }} """" Date: {{ dateLocal[raid.id] }}</p>
                <p>Created by: {{ raid.owner_ign }}</p>
                <p>Players: {{ participantsCount[raid.id] ?? 0 }}/{{ raid.config.players }}</p>
                <p v-if="raid.config.free===false && participantsCountRoles[raid.id]">
                    Tanks: {{ participantsCountRoles[raid.id]?.tanks }}/{{ raid.config.tanks }}
                    Healers: {{ participantsCountRoles[raid.id]?.healers }}/{{ raid.config.healers }}
                    DPS: {{ participantsCountRoles[raid.id]?.dps }}/{{ raid.config.dps }}
                </p>
                
                
            </div>
        </div>
    </div>

</template>

<style scoped>
.container {
    padding: 20px;
}
.raids {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>