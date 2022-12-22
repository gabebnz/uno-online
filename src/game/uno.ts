import { useContext } from "react";
import { getBotNames } from './bot';
import { Card, cardToString, getShuffledDeck } from "./deck";

export type PlayerType = 'local' | 'bot' | 'online';

export interface PlayerState {
    type: PlayerType;

    hand: Card[];
    name: string;

    isSkipped: boolean;
    isUno: boolean;
    isTurn: boolean;
    isWinner: boolean;

    time_left: number;
}

export interface GameState {
    players: PlayerState[];
    currentPlayer: PlayerState | null;
    deck: Card[];
    discard: Card[];
    direction: boolean; // true = clockwise, false = counterclockwise

    askForColor: boolean; // true = current player must choose a color
    currentColor: string; // color chosen by current player

    isUnoCallPossible: boolean; // true = player has 1 card left hasnt called uno
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
                hand: shuffledDeck.splice(0, 7),
                name:'', // updatein a component -- cant use settings context here
                isSkipped: false,
                isUno: false,
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
                isTurn: false,
                isWinner: false,
                time_left: 0,
            }
        ],
        currentPlayer: null,
        deck: shuffledDeck,
        discard: [shuffledDeck.pop() as Card], // turnover first card
        direction: true, 

        askForColor: false,
        currentColor: 'red',

        isUnoCallPossible: false,
        wasUnoCalled: false,

        winner: null,
        playing: false,
    }    

    return state;
}

const UnoCheckCard = (state: GameState, card: Card): boolean => {
    const topCard = state.discard[state.discard.length - 1];
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

export const UnoPlayCard = (state: GameState, card: Card): boolean => {

    state.isUnoCallPossible = false;

    // card cannot be played
    if (!UnoCheckCard(state, card)) {
        return false;
    }

    // Remove card from player's hand
    state.discard.push(card);
    state.currentPlayer!.hand.splice(state.currentPlayer!.hand.indexOf(card), 1); // maybe dont use splice

    // Update the games current color
    state.currentColor = card.color;

    // check if player has won
    if (state.currentPlayer!.hand.length === 0 && state.currentPlayer!.isUno && state.wasUnoCalled) {

        state.playing = false;
        state.currentPlayer!.isWinner = true;
        state.winner = state.currentPlayer;

        return true;
    }

    // check if player has 1 card left: they need to call uno before next player begins their turn
    if (state.currentPlayer!.hand.length === 1) {
        state.isUnoCallPossible = true;
    }

    // card actions
    switch (card.value) {
        case 'skip':
            skipNextPlayer(state);
            break;
        case 'reverse':
            state.direction = !state.direction; // will have state watching this value
            break;
        case '+2':
            pickUp(state, getNextPlayer(state), 2)
            //dispatch({type: 'draw', payload: card.value}); //reducer
            break;
        case '+4':
            // The CHALLENGE +4 card logic should go here
            pickUp(state, getNextPlayer(state), 4)
            state.askForColor = true;
            // THIS WILL TRIGGER A USEEFFECT TO BRING UP A MODAL TO CHOOSE A COLOR
            // THAT MODAL CAN CALL THE DISPATCH TO ADD THE COLOR TO THE STATE AND +4
            break;
        case 'wild':
            state.askForColor = true;
            break;
        default:
            break;
    }

    return true;
}

export function pickUp(state:GameState, target:PlayerState, quantity: number){
    const drawn = state.deck.splice(0, quantity)

    for(let i = 0; i < quantity; i++){
        target.hand.push(drawn[i])
    }
}

function skipNextPlayer(state: GameState){
    const nextPlayer = getNextPlayer(state)
    nextPlayer.isSkipped = true;
}

function getNextPlayer(state: GameState){
    const currPlayerIndex = state.players.indexOf(state.currentPlayer!)

    if(state.direction){ // clockwise
        return state.players[(currPlayerIndex + 1) % state.players.length]
    }
    else{ // counter clockwise
        return state.players[(currPlayerIndex - 1) % state.players.length]
    }
}

export function setNextPlayer(state: GameState){    
    state.currentPlayer = getNextPlayer(state);
}