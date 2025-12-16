import { Option, OptionCreated } from "../../app/modulos/models/Options";
import { Poll, PollInsert, PollResult } from "../../app/modulos/models/Polls";
import { supabase } from "../server/supabase";
import { authService } from "./authService";

export type searchQuery = {
    text: string;
    state: string;
    order?: boolean; 
}

export const pollService = {
    getPollsByUserId: async (id: string): Promise<Poll[]> => {
        const { data, error } = await supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .eq("creator_id", id)
            .order("created_at", { ascending: false })

        if (error) throw new Error(error.message);

        return data || [];
    },

    getPolls: async ({text, state , order } : searchQuery) => {
        let query = supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .ilike(`title`, `%${text}%`)
            .order('created_at', { ascending: order});

        if (state !== "all") {
            query.eq('status', state);
        }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        return data || [];
    },

    getPollById: async (id: number): Promise<Poll> => {
        const { data, error } = await supabase
            .from("poll")
            .select("*, profile(id, username, color)")
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);

        return data;
    },

    getPollResult: async (id: number): Promise<PollResult> => {
        const { data, error } = await supabase
            .from("poll")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);

        return data;
    },

    getOptionsByPoll: async (id: number): Promise<Option[]> => {
        const { data, error } = await supabase
            .from("option")
            .select("*")
            .eq("poll_id", id)
            .order("option_order", { ascending: true });

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

        if (optionError)
            throw new Error("error de option = " + optionError.message);

        return data.id;
    },

    onPollChange: async (user_id: string, callback: () => void) => {
        const channel = supabase
            .channel(`user:${user_id}:polls`)
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    table: "poll",
                    event: "*",
                    filter: `creator_id=eq.${user_id}`,
                },
                (payload) => {
                    callback();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },

    onPollUpdate: async (callback: () => void) => {
        const channel = supabase
            .channel(`search:polls`)
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    table: "poll",
                    event: "*",
                },
                (payload) => {
                    callback();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
};
