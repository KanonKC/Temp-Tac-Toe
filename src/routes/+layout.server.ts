import { prisma } from "../prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionId = cookies.get("session_id");

    if (!sessionId) {
        return {
            user: null
        }
    }

    const session = await prisma.authSession.findUnique({
        where: {
            id: sessionId
        },
        include: {
            user: true
        }
    });

    if (!session) {
        return {
            user: null
        }
    }

    return {
        user: session.user
    }


}
