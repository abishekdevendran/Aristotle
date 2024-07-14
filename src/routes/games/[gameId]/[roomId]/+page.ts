import PartySocket from "partysocket";
import type { PageLoad } from "./$types";
import { PUBLIC_PARTY_URL } from "$env/static/public";
import { browser } from "$app/environment";

export const load: PageLoad = async ({ fetch, data }) => {
    return {
        ...data,
        socket: browser ? new PartySocket({
            host: PUBLIC_PARTY_URL,
            room: data.roomId,
            query: {
                sessionId: data.session?.id,
                userId: data.user?.id,
            }
        }) : null
    }
};