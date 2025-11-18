import { Vote } from "../../app/modulos/models/Vote";
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


    //verificar si voto
    //Insertar en supabase
    insertVote: async (vote: Vote) => {
        const id = await authService.getSession().then(s => s?.user.id);

        vote.user_id = id;

        const { error } = await supabase.from('vote').insert(vote);


        if (error) throw new Error(error.message);
    }
};