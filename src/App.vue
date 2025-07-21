<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, watch} from 'vue';
import { useAuthStore } from './stores/auth.js';
import { eventBus } from './eventbus.js';
import CompleteProfileModal from './components/CompleteProfileModal.vue';

const auth = useAuthStore();
const showModal = ref(false);

const checkProfile = () => {
    if(
      auth.user && (!auth.profile?.username || !auth.profile?.ign)
    ){
      showModal.value = true;
    } else {
      showModal.value = false;
    }

};

onMounted(async () => {
    await auth.fetchUser();
    console.log('User fetched:', auth.user);
    console.log('Profile fetched:', auth.profile);
    eventBus.on('user-logged-in', () => {
      checkProfile();
    });
});

watch(
  () => [auth.profile?.username, auth.profile?.ign],
  () => {
    checkProfile();
  }
);


</script>

<template>
  <RouterView />
  <CompleteProfileModal
    :show="showModal"
    :onClose="() =>  showModal = false"
  />
</template>

<style scoped>

</style>
