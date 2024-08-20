export interface Community {
    id: number;
    name: string;
    description: string;
    tags: string[];
    commitCount: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    commitCount: number;
}
