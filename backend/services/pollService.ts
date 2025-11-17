import { Option, OptionCreated } from "../../app/modulos/models/Options";
import { Poll, PollInsert } from "../../app/modulos/models/Polls";
import { supabase } from "../server/supabase";
import { authService } from "./authService";

export const pollService = {
    getPollsByUserId: async (id: string): Promise<Poll[]> => {
        const { data, error } = await supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .eq("creator_id", id);

        if (error) throw new Error(error.message);

        return data || [];
    },

    getPolls: async (text: string) => {
        const { data, error } = await supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .or(
                `title.ilike.%${text}%`
            )
            .or(`username.ilike.%${text}%`, { foreignTable: "profile" });
            //.or(`title.ilike.%${text}%,profile.username.ilike.%${text}%`)

        if (error) throw new Error(error.message);

        return data || [];
    },

    insertPoll: async (poll: PollInsert, options: OptionCreated[]) => {
        const auth = await authService.getSession().then((e) => e?.user);

        poll.creator_id = auth!.id;

        const { data, error } = await supabase
            .from("poll")
            .insert(poll)
            .select("id")
            .single();

        if (error) throw new Error("error de poll = " + error.message);

        const optionsToInsert: Option[] = options.map((opt, index) => ({
            option_text: opt.optionText.trim(),
            option_order: index + 1,
            poll_id: data.id,
        }));

        const { error: optionError } = await supabase
            .from("option")
            .insert(optionsToInsert);

        if (optionError) throw new Error("error de option = " + optionError.message);
    }
}