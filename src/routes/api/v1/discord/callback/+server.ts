import { json, redirect, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "../../../../../prisma";
import discord from "$lib/discord";

export const GET: RequestHandler = async ({ request, cookies }) => {

    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return json({ error: "No code" }, { status: 400 })
    }

    try {
        const token = await discord.auth.getToken(code);
        const user = await discord.users.getCurrent(token.access_token);

        const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`;

        const dbUser = await prisma.user.upsert({
            where: {
                discord_id: user.id
            },
            update: {
                username: user.username,
                avatar: user.avatar,
                avatar_url: avatarUrl,
                display_name: user.global_name || user.username
            },
            create: {
                discord_id: user.id,
                username: user.username,
                avatar: user.avatar,
                avatar_url: avatarUrl,
                display_name: user.global_name || user.username
            }
        });

        const session = await prisma.authSession.create({
            data: {
                user_id: dbUser.id,
                expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            }
        });

        // cookies is available in RequestEvent, need to destructure it from arguments


        cookies.set("session_id", session.id, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

    } catch (error) {
        console.error('Discord API Error:', error);
        return json({ error: 'Failed to authenticate' }, { status: 500 });
    }

    throw redirect(302, "/");
}