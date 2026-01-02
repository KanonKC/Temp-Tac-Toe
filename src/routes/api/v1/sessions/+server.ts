import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "../../../../prisma";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    console.log('Body:', body);

    try {
        const result = await prisma.session.create({
            data: body
        })
        return json(result, { status: 201 })
    } catch (error) {
        console.error('Error creating session:', error);
        return json({ error: 'Failed to create session' }, { status: 500 })
    }
}