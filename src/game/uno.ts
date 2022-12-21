import { useContext } from "react";
import { SettingsContext } from "../providers/SettingsProvider";
import { getBotNames } from './bot';
import { Card, cardToString, getShuffledDeck } from "./deck";

export type PlayerType = 'local' | 'bot' | 'online';

export interface PlayerState {
    type: PlayerType;

    hand: Card[];
    name: string;

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

    playing: boolean;

}

export const UnoInitializeState = ():GameState => {
    const settings = useContext(SettingsContext);
    const shuffledDeck = getShuffledDeck();
    const botNames = getBotNames();

    const state: GameState = {
        players: [
            {
                type: 'local',
                hand: shuffledDeck.splice(0, 7),
                name: settings.username,
                isUno: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[0],
                isUno: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[1],
                isUno: false,
                isTurn: false,
                isWinner: false,
                time_left: 0,
            },
            {
                type: 'bot',
                hand: shuffledDeck.splice(0, 7),
                name: botNames[2],
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

    // 
    if (!UnoCheckCard(state, card)) {
        return false;
    }

    // Remove card from player's hand
    state.discard.push(card);
    state.currentPlayer!.hand.splice(state.currentPlayer!.hand.indexOf(card), 1);


    state.currentColor = card.color;



    // TODO: keep doing card logic
    // To the comments
    // I actually dont think i need a reducer for this. just do it all here.



    // check if player has won
    if (state.currentPlayer!.hand.length === 0 && state.currentPlayer!.isUno && state.wasUnoCalled) {
        state.currentPlayer!.isWinner = true;

        // when reducer is written?
        //Dispatch({type: 'winner');
    }

    // check if player has 1 card left: they need to call uno before next player begins their turn
    if (state.currentPlayer!.hand.length === 1) {
        state.isUnoCallPossible = true;
    }

    // card actions
    switch (card.value) {
        case 'skip':
            //dispatch({type: 'skip'});  <-- for reducer
            break;
        case 'reverse':
            state.direction = !state.direction; // will have state watching this value
            break;
        case '+2':
            //dispatch({type: 'draw', payload: card.value}); //reducer
            break;
        case '+4':
            state.askForColor = true;
            // THIS WILL TRIGGER A USEEFFECT TO BRING UP A MODAL TO CHOOSE A COLOR
            // THAT MODAL CAN CALL THE DISPATCH TO ADD THE COLOR TO THE STATE AND +4
            break;
        case 'wild':
            //dispatch({type: 'color', payload: card.color}); //reducer
            break;
        default:
            break;
    }





    return true;
}