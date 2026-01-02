import type { DiscordToken, DiscordUser } from "./response";

const API_ENDPOINT = 'https://discord.com/api/v10';
const CLIENT_ID = '726338362151141437';
const CLIENT_SECRET = '3dIVJw4ehTNv9sYwDK6LnQnVfKjFwxLQ';
const REDIRECT_URI = 'http://localhost:5173/api/v1/discord/callback';

async function getAuthorizationUrl() {
    return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify`;
}

async function getToken(code: string): Promise<DiscordToken> {
    const data = new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
    };

    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        body: data,
        headers: headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch token');
    }

    return response.json();
}

async function getCurrentUser(token: string): Promise<DiscordUser> {
    const response = await fetch(`${API_ENDPOINT}/users/@me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch current user');
    }

    return response.json();
}

const discord = {
    auth: {
        getLogin: getAuthorizationUrl,
        getToken: getToken,
    },
    users: {
        getCurrent: getCurrentUser
    }
}

export default discord;