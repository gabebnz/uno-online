import { UpdateGame } from '../providers/GameProvider';
import { getBotNames } from './bot';
import { Card, cardToString, getShuffledDeck } from "./deck";

export type PlayerType = 'local' | 'bot' | 'online';

export interface PlayerState {
    type: PlayerType;

    hand: Card[];
    name: string;

    
    isUnoCallPossible: boolean; // true = player has 1 card left hasnt called uno
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

    wasUnoCalled: boolean; // true = uno has been called by player with last card

    winner : PlayerState | null;
    playing: boolean;

}

export const UnoInitialState: GameState = InitializeState();

function InitializeState ():GameState {
    const shuffledDeck = getShuffledDeck();
    const botNames = getBotNames();

    const state: GameState = {
        players: [
            {
                type: 'local',
                hand: shuffledDeck.splice(0, 2),
                name:'', // updatein a component -- cant use settings context here
                isSkipped: false,
                isUno: false,
                isUnoCallPossible: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[0],
                isSkipped: false,
                isUno: false,
                isUnoCallPossible: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[1],
                isSkipped: false,
                isUno: false,
                isUnoCallPossible: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[2],
                isSkipped: false,
                isUno: false,
                isUnoCallPossible: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            }
        ],
        currentPlayer: 0,
        deck: shuffledDeck,
        discard: [shuffledDeck.pop() as Card], // turnover first card
        direction: true, 

        askForColor: false,
        currentColor: 'wild',

        wasUnoCalled: false,

        winner: null,
        playing: true,
    }    

    state.discard[0].rotation = Math.floor(Math.random() * 30)-15; // make sure first card has readable rotation
    state.discard[0].playedBy = 4; // give special value to indicate card was drawn from deck

    return state;
}



// --- NEW REDUCER METHODS --- //
// can edit state directly as it is a new copy of the state from the reducer


// Future: change this so that new initial game state is created, not just on refresh
export const newGame = (): GameState => {
    return InitializeState();
}

export const playCard = (state: GameState, card: Card): GameState => {
    if (!UnoCheckCard(state, card)) {
        console.log('card cannot be played');
        
        return state;
    }

    removePossibleUnoCalls(state); // Someone could have called uno, but next card was played

    // Remove card from player's hand
    state.discard = [card, ...state.discard];
    
    state.players[state.currentPlayer!].hand = state.players[state.currentPlayer!].hand
    .filter(item => {            
        return item !== card;
    }); 

    // assign cards current player
    card.playedBy = state.currentPlayer!;

    // Update the games current color
    state.currentColor = card.color;

    // check if player has won
    if (state.players[state.currentPlayer!].hand.length === 0 && state.players[state.currentPlayer!].isUno && state.wasUnoCalled) {
        state.playing = false;
        state.players[state.currentPlayer!].isWinner = true;
        state.winner = state.players[state.currentPlayer!];

        return state; // game is over -- no need to continue to update other state values
    }

    // check if player has 1 card left: they need to call uno before next player begins their turn
    if (state.players[state.currentPlayer!].hand.length === 1) {
        state.players[state.currentPlayer!].isUnoCallPossible = true;
    }

    // card actions
    switch (card.value) {
        case 'skip':
            skipPlayer(state);
            break;
        case 'reverse':
            state.direction = !state.direction;
            break;
        case '+2':
            pickupCard(state, getNextPlayer(state), 2)
            break;
        case '+4':
            // The CHALLENGE +4 card logic should go here
            pickupCard(state, getNextPlayer(state), 4)
            state.askForColor = true;
            break;
        case 'wild':
            state.askForColor = true;
            break;
        default:
            break;
    }


    return state;
}

export function pickupCard(state: GameState, targetIndex: number, quantity:number): GameState{
    const drawn = state.deck.splice(0, quantity)
    state.players[targetIndex].hand = [...state.players[targetIndex].hand, ...drawn];
    state.players[targetIndex].isUno = false;// Player has picked up, thus uno call is cancelled


    return state;
}

function skipPlayer(state:GameState): GameState {
    const skippedPlayer = state.players[getNextPlayer(state)];
    skippedPlayer.isSkipped = true;

    return state;
}

function getNextPlayer(state: GameState): number{
    if(state.direction){ // clockwise
        return state.players.indexOf(state.players[(state.currentPlayer! + 1) % state.players.length])
    }
    else{ // counter clockwise
        return state.players.indexOf(state.players[(state.currentPlayer! + (state.players.length - 1)) % state.players.length])
    }

}

export function finishTurn(state: GameState) {

    // clear skipped persons state before moving to next player
    if(state.players[state.currentPlayer!].isSkipped){
        state.players[state.currentPlayer!].isSkipped = false;
    }

    if(!state.askForColor && state.playing){
        // set current player to false
        state.players[state.currentPlayer!].isTurn = false;

        // set next player attributes
        state.currentPlayer = getNextPlayer(state);
        state.players[state.currentPlayer!].isTurn = true;
    }


    return state;
}



export function checkPlayableCards(state: GameState): Card[] | false {

    const playableCards = state.players[state.currentPlayer!].hand.filter(card => {
        return UnoCheckCard(state, card);
    });

    if(playableCards.length === 0) {
        return false
    }

    return playableCards;
}

export function botTurn(state: GameState): GameState{
    const playableCards = checkPlayableCards(state);

    const colors = ['red', 'blue', 'green', 'yellow'];

    if(playableCards){

        if(state.players[state.currentPlayer!].isUnoCallPossible && !state.players[state.currentPlayer!].isUno ){

            console.log('bot called uno');
            
            callUno(state, state.currentPlayer!);
        }

        const card = playableCards[Math.floor(Math.random() * playableCards.length)];
        playCard(state, card);

        if(card.value === 'wild' || card.value === '+4'){
            setTimeout(() => {
                setColor(state, colors[Math.floor(Math.random() * colors.length)]);
            }, 500);
        }
    } else {
        pickupCard(state, state.currentPlayer!, 1);
    }

    return state;
}

export function startTimer(state:GameState, playerIndex:number){
    state.players[playerIndex].time_left = 10;
    return state;
}

export function setColor(state:GameState, color:string){
    state.currentColor = color;
    state.discard[0].color = color;
    state.askForColor = false;
    
    return state;
}



export function UnoCheckCard (state: GameState, card: Card): boolean {
    const topCard = state.discard[0];
    if (card.color === topCard.color) {
        return true;
    }
    if (card.value === topCard.value) {
        return true;
    }
    if (card.value === 'wild' || card.value === '+4') {
        return true;
    }

    return false;
}




function removePossibleUnoCalls(state: GameState): GameState{
    state.players.forEach(player => {
        player.isUnoCallPossible = false;
    });

    return state;
}

export function callUno(state:GameState, playerIndex:number){
    console.log("player" + playerIndex + " called uno");
    
    state.players[playerIndex].isUno = true;
    state.wasUnoCalled = true;

    return state;
}

export function setUnoCallPossible(state:GameState, playerIndex:number){
    state.players[playerIndex!].isUnoCallPossible = true;

    return state;
}