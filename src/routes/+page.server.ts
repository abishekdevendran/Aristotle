import type { Achievement } from '$lib/games/games.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch }) => {
  if (!locals.user) redirect(302, '/login');
  return {
    user: locals.user,
    games: fetch('/games').then(res => res.json()) as Promise<{
      name: string;
      description: string;
      minPlayers: number;
      maxPlayers: number;
      enabled: boolean;
      achievements: Achievement[];
    }[]>
  }
};
