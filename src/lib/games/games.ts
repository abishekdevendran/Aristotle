export interface Achievement {
    name: string;
    description: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export default {
    "games": [{
        "name": "Chain Reaction",
        "description": "Chain Reaction is a strategy game that can be played by 2 to 10 players. The objective of the game is to take control of the board by eliminating your opponents' orbs.",
        "minPlayers": 2,
        "maxPlayers": 10,
        "enabled": true,
        "achievements": [{
            "name": "First Win",
            "description": "Win your first game of Chain Reaction.",
            "rarity": "common"
        }, {
            "name": "Chain Reaction Master",
            "description": "Win 10 games of Chain Reaction.",
            "rarity": "rare"
        }, {
            "name": "I have become death",
            "description": "Eliminate 2 players in a single turn.",
            "rarity": "epic"
        }, {
            "name": "Chain Reaction Champion",
            "description": "Win 100 games of Chain Reaction.",
            "rarity": "legendary"
        }] as Achievement[]
    }]
}