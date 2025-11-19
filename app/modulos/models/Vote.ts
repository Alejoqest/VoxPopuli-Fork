export type Vote = {
    id?: number;
    voted_at?: Date;
    poll_id: number;
    option_id: number;
    user_id?: string;
}

export type VoteResult = {
    id: number;
    optionName: string;
    optionOrder: number;
    numVotes: number;
    percentageVotes: number;
}