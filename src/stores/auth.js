import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase.js';
import { eventBus } from '../eventbus.js';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const loading = ref(false);
    const profile = ref(null);

    const fetchUser = async () => {
        loading.value = true;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            user.value = session.user;
            await fetchUserProfile();
        } else {
            user.value = null;
        }
        loading.value = false;
    };

    const fetchAllUsers = async () => {
        const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error('Error fetching users:', error.message);
        return [];
    }
    console.log("Fetched users: ", data);
    return data;
    };

    const fetchUserProfile = async() =>{
        if (!user.value) {
            profile.value = null;
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('username,ign,tier')
            .eq('id', user.value.id)
            .single();

        if(error){
            console.error('Error fetching profile:', error.message);
            profile.value = null;
            return null;
        }

        profile.value = data;
        return data;
    };

    const login = async (email , password) => {
        const { data, error } = await supabase.auth.signInWithPassword(
            { email, password}
        );
        if (error) {
            throw error;
        }
        user.value = data.user;
        await fetchUserProfile();
        eventBus.emit('user-logged-in');
    };
    const logout = async () => {
        await supabase.auth.signOut();
        user.value = null;
    };

    const updateProfile = async (username, ign) => {
        if (!user.value) {
            return { error: new Error('User not logged in')};
        }

        const { error } = await supabase
        .from('profiles')
        .upsert({ id:user.value.id,username, ign})
        .eq('id', user.value.id);
        if(!error){
            await fetchUserProfile();
        }
        return { error };
    }

    supabase.auth.onAuthStateChange((_event, session) =>{
        user.value = session?.user ?? null;
        if (user.value) {
            fetchUserProfile();
        } else {
            profile.value = null;
        }
            
    });

    return {
        user,
        profile,
        loading,
        fetchUser,
        fetchAllUsers,
        fetchUserProfile,
        login,
        logout,
        updateProfile,
    };
}

);