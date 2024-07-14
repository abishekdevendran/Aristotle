import { lucia } from '$lib/server/auth.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
    const { userId, sessionId } = Object.fromEntries(url.searchParams.entries());
    const { session, user } = await lucia.validateSession(sessionId);
    if (session?.id !== sessionId || user?.id !== userId) {
        throw error(401, {
            'message': 'unauthorized'
        })
    }
    return json({
        'message': 'validated',
        user
    })
}