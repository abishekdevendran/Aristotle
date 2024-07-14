export type GAME_STATUS = 'LOBBY' | 'IN_SESSION';

export interface Player {
    id: string;
    connId?: string;
    name: string;
}

export interface GameState {
    slug: string | undefined;
    newCoinCol: number | null;
    newCoinRow: number | null;
    message: string;
    status: GAME_STATUS;
    player1: Player;
    player2: Player;
    board: number[][];
    waitingFor: string | undefined;
    winner: string | undefined;
}

export type MessageType = 'JOIN' | 'UPDATE' | 'MESSAGE'