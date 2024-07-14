import { error, json } from '@sveltejs/kit';
import { queryDb } from '$lib/server/db/index.js';
import gamesData from '$lib/games/games.js';

export async function GET({ params }) {
    const gameId = params.gameId;
    const game = await queryDb.query.gameTable.findFirst({
        where: (game,{eq, and})=> and(eq(game.id, gameId))
    });
    // check if it's enabled
    if(!game){
        return json({
            error: 'Game not found'
        });
    }
    const foundEntry=gamesData.games.find(g => g.name === game.name);
    if(!foundEntry || !foundEntry.enabled) {
        return json({
            error: 'Game is not up right now. Try again later!'
        });
    }
    return json(foundEntry);
}