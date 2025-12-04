export type Poll = {
    id: number;
    title: string;
    description?: string;
    start_time: Date;
    end_time: Date;
    status: "waiting" | "active" | "closed";
    profile: {
        id: string;
        username: string;
        color: string;
    } | null;
};

export type PollResult = {
    id: number;
    title: string;
    totalVotes?: number;
}

export type PollUser = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    status: "waiting" | "active" | "closed";
}

export type PollInsert = {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status?: "waiting" | "active" | "closed";
    creator_id?: string;
}