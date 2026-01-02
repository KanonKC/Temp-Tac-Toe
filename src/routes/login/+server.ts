import { redirect, type RequestHandler } from "@sveltejs/kit";
import discord from "$lib/discord";

export const GET: RequestHandler = async () => {
    const url = await discord.auth.getLogin();
    throw redirect(302, url);
}
