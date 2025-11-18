export type Vote = {
    id?: number;
    voted_at?: Date;
    poll_id: number;
    option_id: number;
    user_id?: string; 
}
