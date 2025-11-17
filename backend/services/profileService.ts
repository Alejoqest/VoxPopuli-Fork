import { Profile } from "../../app/modulos/models/Profile";
import { supabase } from "../server/supabase";

export const profileService = {
    getUser: async (id: string): Promise<Profile> => {
        const { data, error } = await supabase
            .from("profile")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);

        return data;
    },
}