export type Card = {
    type: string; // number, action, wild
    color: string; // red, blue, green, yellow, wild
    value?: string; // 0-9, +2, reverse, skip, wild, +4
    playedBy?: number; // player index of who played this card, for animations

    rotation?: number;
    offsetX?:number;
    offsetY?:number;
}

export type PlayerType = 'player' | 'bot';

export interface PlayerState {
    type: PlayerType;
 
    hand: Card[];
    name: string;

    socketID?: string;

    
    isUnoCallPossible: boolean; // true = player has 1/2 card(s) left hasnt called uno
    isUno: boolean; // the player has called uno and is on last card

    isSkipped: boolean;
    isTurn: boolean;
    isWinner: boolean;

    time_left: number;
}

export interface GameState {
    players: PlayerState[];
    currentPlayer: number | null;

    deck: Card[];
    discard: Card[];

    direction: boolean; // true = clockwise, false = counterclockwise

    askForColor: boolean; // true = current player must choose a color
    currentColor: string; // color chosen by current player

    shouldCallUno: string | null; // player socketid of who should call uno 
    wasUnoCalled: boolean; // true = uno has been called by player with last card

    winner : PlayerState | null;
    playing: boolean;
}