import { Poll } from "../../app/modulos/models/Polls";
import { supabase } from "../server/supabase";

export const pollService = {
    getPollsByUserId: async (id: string) : Promise<Poll[]> => {
        const { data, error } = await supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .eq("creator_id", id);
        if (error) throw new Error(error.message);

        return data || [];
    }
}