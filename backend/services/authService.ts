import { Session } from "@supabase/supabase-js";
import { chartColors } from "../../app/modulos/screens/pollResults/colors";
import { supabase } from "../server/supabase";

export const authService = {
    getSession: async (): Promise<Session | null> => {
        const { data } = await supabase.auth.getSession();
        return data.session ?? null;
    },

    onAuthStateChange: async (callback: (session: Session | null) => void) => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });

        return () => listener.subscription.unsubscribe();
    },

    registerUser: async (email: string, password: string, username: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('User already registered')) return ('Ya existe un usuario con esas crendenciales')
            return error.message;
        }

        const user = data.user;
        if (!user) return "User no retornado";

        const i = Math.floor(Math.random() * 10);
        const color = chartColors[i];

        const { error: profileError } = await supabase.from('profile').insert({
            id: user.id,
            email: user.email,
            username: username,
            color: color
        })
        return profileError?.message || null;
    },

    login: async (text: string, password: string) => {
        const { data } = await supabase.from('profile').select('*').or(`email.eq.${text},username.eq.${text}`).single();

        if (!data) return ("No hay usuario");

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password,
        });

        if (loginError) {
            if (loginError.message.includes("Email not confirmed")) return ("Correo no verificado" + "\n" +
                "Por favor, verifica tu correo electrónico antes de iniciar sesión.")

            if (loginError.message.includes('Invalid login credentials')) return ('Contraseña equivocada');
        }

        return loginError?.message || null;
    },

    logoutUser: async () => {
        await supabase.auth.signOut();
    }
}