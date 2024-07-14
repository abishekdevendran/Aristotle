import { db, queryDb } from "$lib/server/db";
import gamesConfig, { type Achievement } from './games';
import { achievementTable, gameTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from 'nanoid'
import { dev } from "$app/environment";

const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;

export interface GameInterface {
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    enabled: boolean;
    achievements: Achievement[];
}

class Game {
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    enabled: boolean;
    achievements: Achievement[];
    constructor(config: GameInterface) {
        this.name = config.name;
        this.description = config.description;
        this.minPlayers = config.minPlayers;
        this.maxPlayers = config.maxPlayers;
        this.enabled = config.enabled;
        this.achievements = config.achievements || [];
    }

    async register() {
        if (!this.enabled) {
            console.log(`Skipping disabled game: ${this.name}`);
            return;
        }

        const existingGame = await queryDb.query.gameTable.findFirst({
            where: (game, { eq }) => eq(game.name, this.name)
        })

        if (!existingGame) {
            console.log(`Registering new game: ${this.name}`);
            const gameId = this.name.replace(/\s/g, '-').toLowerCase();
            await db.insert(gameTable).values({
                id: gameId,
                name: this.name,
                minPlayers: this.minPlayers,
                maxPlayers: this.maxPlayers,
                releaseDate: new Date(),
                updateDate: new Date(),
                description: this.description,
            })

            // Register achievements
            for (const achievement of this.achievements) {
                await db.insert(achievementTable).values({
                    id: nanoid(),
                    gameId: gameId,
                    name: achievement.name,
                    description: achievement.description,
                    rarity: achievement.rarity,
                    points: rarities.indexOf(achievement.rarity) + 1,
                })
            }

            console.log(`Registered game: ${this.name}`);
        } else {
            if (!dev) {
                console.log(`Updating existing game: ${this.name}`);
                // Here you could add logic to update existing game properties if needed
                // update "updateDate" field, and new achievements if any
                await db.update(gameTable).set({
                    updateDate: new Date()
                }).where(eq(gameTable.name, this.name));
                // get achievements
                const existingAchievements = await queryDb.query.achievementTable.findMany({
                    where: (achievement, { eq }) => eq(achievement.gameId, existingGame.id)
                })
                // insert new achievements
                for (const achievement of this.achievements) {
                    const existingAchievement = existingAchievements.find(a => a.name === achievement.name);
                    if (!existingAchievement) {
                        await db.insert(achievementTable).values({
                            id: nanoid(),
                            gameId: existingGame.id,
                            name: achievement.name,
                            description: achievement.description,
                            rarity: achievement.rarity,
                            points: rarities.indexOf(achievement.rarity) + 1,
                        })
                    }
                }
            }
        }
    }
}

export async function loadAndRegisterGames() {
    for (const gameConfig of gamesConfig.games) {
        const game = new Game(gameConfig as GameInterface);
        await game.register();
    }
}