import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "../../../../prisma";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    console.log('Body:', body);
    console.log('Prisma keys:', Object.keys(prisma));

    const result = await prisma.session.create({
        data: {
            data: { foo: 'bar' }
        }
    })
    return json(result, { status: 201 })
}