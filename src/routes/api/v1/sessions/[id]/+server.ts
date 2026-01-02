import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "../../../../../prisma";

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params
    const session = await prisma.session.findUnique({ where: { id } })
    return json(session)
}