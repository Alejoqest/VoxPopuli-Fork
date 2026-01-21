import { Session } from "@supabase/supabase-js";
import { Colors } from "../../app/constants/colors";
import { supabase } from "../server/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
    getSession: async (): Promise<Session | null> => {
        const { data } = await supabase.auth.getSession();
        return data.session ?? null;
    },

    onAuthStateChange: (callback: (session: Session | null) => void) => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });

        return () => {
            data.subscription.unsubscribe();
        };
    },

    registerUser: async (email: string, password: string, username: string) => {
        const { data: dataUser } = await supabase.from('profile').select('*').or(`email.eq.${email},username.eq.${username}`).single();

        if (dataUser) {
            return (`Ya existe una cuenta con ese ${dataUser.email == email ? 'email' : 'nombre de usuario'}`)
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('User already registered')) return ('Ya existe un usuario con esas crendenciales.')
            return error.message;
        }

        const user = data.user;
        if (!user) return ("User no retornado");

        const i = Math.floor(Math.random() * 10);
        const color = Colors[i];

        const { error: profileError } = await supabase.from('profile').insert({
            id: user.id,
            email: user.email,
            username: username,
            color: color
        })

        if (profileError?.message) return profileError.message;

        await AsyncStorage.setItem('user_id', user.id);
    },

    login: async (text: string, password: string) => {
        const { data } = await supabase.from('profile').select('*').or(`email.eq.${text},username.eq.${text}`).single();

        if (!data) return ("No hay usuario con esas crendenciales.");

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password,
        });

        if (loginError) {
            if (loginError.message.includes("Email not confirmed")) return ("Correo no verificado" + "\n" +
                "Por favor, verifica tu correo electrónico antes de iniciar sesión.")

            if (loginError.message.includes('Invalid login credentials')) return ('Contraseña introducida es incorrecta.');
        }

        if (loginError?.message) return loginError.message;

        await AsyncStorage.setItem('user_id', data.id)
    },

    logoutUser: async () => {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('user_id')
    }
}