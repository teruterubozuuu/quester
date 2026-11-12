export type UserProps = {
    username: string;
    display_name: string;
    level: number;
    current_exp: number;
    bio: string;
}

export type FavoriteGame = {
    id: string;
    user_id: string;
    title: string;
    cover: string;
    description: string;
}