import util from '../../client/node_modules/util';
import { getBotNames } from './bot';
import { getShuffledDeck } from "./deck";

import { Card, GameState, PlayerState } from '../../shared/types';



export function generateUnoGame():GameState {
    const shuffledDeck = getShuffledDeck();
    const botNames = getBotNames();

    const state: GameState = {
        players: [
            {
                type: 'player',
                hand: shuffledDeck.splice(0, 7),
                name:botNames[0], 
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
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[3],
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

        shouldCallUno: null,
        wasUnoCalled: false,

        winner: null,
        playing: true,
    }    

    state.discard[0].rotation = Math.floor(Math.random() * 30)-15; // make sure first card has readable rotation
    state.discard[0].playedBy = 4; // give special value to indicate card was drawn from deck for animations

    if(state.discard[0].type === 'wild'){
        const colors = ['red', 'blue', 'green', 'yellow'];
        state.discard[0].color = colors[Math.floor(Math.random() * colors.length)];
    }

    //give wildcard for testing
    // state.players[0].hand.push(
    //     {
    //         type: 'wild', // number, action, wild
    //         color: 'wild', // red, blue, green, yellow, wild
    //         value: 'wild', // 0-9, +2, reverse, skip, wild, +4
    //         playedBy: 0, // player index of who played this card, for animations
        
    //         rotation: 5,
    //         offsetX:10,
    //         offsetY:15,
    //     }
    // )

    return state;
}



// --- NEW REDUCER METHODS --- //
// can edit state directly as it is a new copy of the state
export const newGame = (): GameState => {
    return generateUnoGame();
}

export const playCard = (state: GameState, card: Card): GameState => {
    
    if (!UnoCheckCard(state, card)) {        
        return state;
    }

    removePossibleUnoCalls(state); // Someone could have called uno, but next card was played

    // Remove card from player's hand
    state.discard = [card, ...state.discard];
    

    // Remove card from player's hand
    // https://nodejs.org/api/util.html#util_util_isdeepstrictequal_val1_val2 
    state.players[state.currentPlayer!].hand = state.players[state.currentPlayer!].hand
    .filter(item => {            
        return !util.isDeepStrictEqual(item, card);
    }); 

    // assign cards current player
    card.playedBy = state.currentPlayer!;

    // Update the games current color
    state.currentColor = card.color;

    // check if player has won
    if (state.players[state.currentPlayer!].hand.length === 0) {
        state.playing = false;
        state.players[state.currentPlayer!].isWinner = true;
        state.winner = {...state.players[state.currentPlayer!]};

        return state; // game is over -- no need to continue to update other state values
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
        if(
            state.players[state.currentPlayer!].hand.length <= 2 && 
            !state.players[state.currentPlayer!].isSkipped &&
            !state.players[state.currentPlayer!].isUnoCallPossible
        ){
            setUnoCallPossible(state, state.currentPlayer!);
        }


        if(state.players[state.currentPlayer!].isUnoCallPossible && !state.players[state.currentPlayer!].isUno ){            
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
    state.shouldCallUno = null; // Players can no longer call out player for not calling uno
    state.players.forEach(player => {
        if (state.currentPlayer !== state.players.indexOf(player)){
            player.isUnoCallPossible = false;
        } 
    });

    return state;
}

export function callUno(state:GameState, playerIndex:number){    
    // set uno call state values
    state.players[playerIndex].isUno = true;
    state.players[playerIndex].isUnoCallPossible = false;
    state.shouldCallUno = null;
    state.wasUnoCalled = true;

    return state;
}

export function setUnoCallPossible(state:GameState, playerIndex:number){
    state.players[playerIndex!].isUnoCallPossible = true;

    return state;
}

export function shouldCallUno (state: GameState, playerIndex: number) {    
    state.shouldCallUno = state.players[playerIndex!].socketID!;

    return state
}

export function challengeUno(state: GameState){
    const player = state.players.find(player => player.socketID === state.shouldCallUno)!;

    player.isUno = false;
    player.isUnoCallPossible = false;

    pickupCard(state, state.players.indexOf(player), 2);

    state.wasUnoCalled = false;
    state.shouldCallUno = null;

    return state;
}