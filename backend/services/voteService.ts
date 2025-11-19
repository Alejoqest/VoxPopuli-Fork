import { Vote, VoteResult } from "../../app/modulos/models/Vote";
import { supabase } from "../server/supabase";
import { authService } from "./authService";

export const voteService = {
    getVote: async (pollId: number): Promise<Vote | null> => {
        const id = await authService.getSession().then(s => s?.user.id);

        const { data, error } = await supabase.from('vote').select('*').eq('poll_id', pollId).eq('user_id', id).single();

        if (!data) return null;

        if (error) throw new Error(error.message);

        return data;
    },

    getResults: async (pollId: number): Promise<VoteResult[]> => {
        const { data, error } = await supabase
            .from("vote_view")
            .select("*")
            .eq("poll_id", pollId)
            .order("optionOrder", { ascending: true });

        if (error) {
            console.error("Error loading results", error);
            return [];
        }

        return data ?? [];
    },

    onVotesChange(pollId: number, callback: () => void) {
        const channel = supabase
            .channel(`poll_votes_${pollId}`)
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    table: "vote",
                    event: "*",
                    filter: `poll_id=eq.${pollId}`,
                },
                payload => {
                    callback(); // notify UI
                }
            )
            .subscribe();

        // 🔥 return proper unsubscribe
        return () => {
            supabase.removeChannel(channel);
        };
    },


    //verificar si voto
    //Insertar en supabase
    insertVote: async (vote: Vote) => {
        const id = await authService.getSession().then(s => s?.user.id);

        vote.user_id = id;

        const { error } = await supabase.from('vote').insert(vote);


        if (error) throw new Error(error.message);
    }
};