import { Profile, ProfileAvatar } from "../../app/modulos/models/Profile";
import { VoteUser } from "../../app/modulos/models/Vote";
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

    getUsersByVote: async (optionId: number): Promise<VoteUser[]> => {
        const { data, error } = await supabase
            .from('vote')
            .select('*, profile(id, username, color)')
            .eq('option_id', optionId)
            .order('voted_at', { ascending: false });

        if (error) throw new Error(error.message);

        return data || [];
    },
}