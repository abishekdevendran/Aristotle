import { json } from '@sveltejs/kit';
import gamesConfig from '$lib/games/games';

export function GET() {
    const enabledGames = gamesConfig.games.filter(game => game.enabled);
    return json(enabledGames);
}