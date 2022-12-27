import { useContext } from "react";
import { UpdateGame } from '../providers/GameProvider';
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
    currentPlayer: number | null;
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

export const UnoPlayCard = (state: GameState & {updateGame: UpdateGame}, card: Card): boolean => {
    // card cannot be played
    if (!UnoCheckCard(state, card)) {
        console.log('card cannot be played');
        
        return false;
    }

    // It is VERY possible to clean this up
    // expecially the current player calls.

    
    state.updateGame(prev =>{
        const newState = {...prev};
        // MOVE EVERYTHING HERE
        newState.isUnoCallPossible = false;

        // Remove card from player's hand
        newState.discard= [card, ...newState.discard];
        
        newState.players[newState.currentPlayer!].hand = newState.players[newState.currentPlayer!].hand.filter(item => {            
            return item !== card;
        }); 
        

        // Update the games current color
        newState.currentColor = card.color;

        // check if player has won
        if (state.players[newState.currentPlayer!].hand.length === 0 && state.players[newState.currentPlayer!].isUno && state.wasUnoCalled) {

            newState.playing = false;
            newState.players[newState.currentPlayer!].isWinner = true;
            newState.winner = newState.players[newState.currentPlayer!];

            return newState;
        }

        // check if player has 1 card left: they need to call uno before next player begins their turn
        if (state.players[newState.currentPlayer!].hand.length === 1) {
            newState.isUnoCallPossible = true;
        }


            return newState;
    });
    
    // card actions
    switch (card.value) {
        case 'skip':
            skipNextPlayer(state);
            break;
        case 'reverse':
            state.updateGame(prev => {
                prev.direction = !prev.direction;
                return prev;
            })
            break;
        case '+2':
            pickUp(state, getNextPlayer(state), 2)
            //dispatch({type: 'draw', payload: card.value}); //reducer
            break;
        case '+4':
            // The CHALLENGE +4 card logic should go here
            pickUp(state, getNextPlayer(state), 4)
            state.updateGame(prev => {
                prev.askForColor = !prev.askForColor;
                return prev;
            })

            // THIS WILL TRIGGER A USEEFFECT TO BRING UP A MODAL TO CHOOSE A COLOR
            // THAT MODAL CAN CALL THE DISPATCH TO ADD THE COLOR TO THE STATE AND +4
            break;
        case 'wild':
            state.updateGame(prev => {
                prev.askForColor = !prev.askForColor;
                return prev;
            })
            break;
        default:
            break;
    }

    return true;
}

export function pickUp(state:GameState & {updateGame: UpdateGame}, target:PlayerState, quantity: number){
    state.updateGame(prev => {
        const newState = {...prev};
        console.log(newState.deck.slice(0, quantity -1 ));
        
        return newState;
    })

    const drawn = state.deck.slice(0, quantity) // dont use splice

    for(let i = 0; i < quantity; i++){
        target.hand.push(drawn[i])
    }
}

function skipNextPlayer(state: GameState){
    // state is new state
    //const nextPlayer = getNextPlayer(state)
    //nextPlayer.isSkipped = true;
}

function getNextPlayer(state: GameState){
    if(state.direction){ // clockwise
        return state.players[(state.currentPlayer! + 1) % state.players.length]
    }
    else{ // counter clockwise
        return state.players[(state.currentPlayer!  - 1) % state.players.length]
    }
}

export function setInitialPlayer(state:GameState & {updateGame: UpdateGame}){
    state.updateGame(prev => {
        prev.currentPlayer = 0;
        prev.players[prev.currentPlayer].isTurn = true;
        return {...prev}
    })
}

export function setNextPlayer(state: GameState){    
    //state.currentPlayer = getNextPlayer(state);
}