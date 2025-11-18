export type Poll = {
    id: number;
    title: string;
    description?: string;
    start_time: Date;
    end_time: Date;
    status: "active" | "closed";
    profile: {
        id: string;
        username: string;
        color: string;
    }
};

export type PollUser = {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    status: "active" | "closed";
}

export type PollInsert = {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    status: "active" | "closed";
    creator_id?: string;
}