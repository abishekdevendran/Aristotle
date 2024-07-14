import type {  TGameTable } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, params }) => {
    if (!locals.user) redirect(302, '/login');
    return {
        user: locals.user,
        session: locals.session,
        game: await (fetch(`/games/${params.gameId}`).then(res => res.json()) as Promise<TGameTable>),
        roomId: params.roomId,
    }
}