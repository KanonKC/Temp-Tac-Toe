export interface DiscordUser {
    id: string;
    username: string;
    global_name: string | null;
    discriminator: string;
    avatar: string;
    verified: boolean;
    email: string;
    flags: number;
    banner: string;
    accent_color: number;
    premium_type: number;
    public_flags: number;
    avatar_decoration_data?: {
        sku_id: string;
        asset: string;
    };
    collectibles?: {
        nameplate?: {
            sku_id: string;
            asset: string;
            label: string;
            palette: string;
        };
    };
    primary_guild?: {
        identity_guild_id: string;
        identity_enabled: boolean;
        tag: string;
        badge: string;
    };
}

export interface DiscordToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}