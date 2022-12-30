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

    state.discard[0].rotation = Math.floor(Math.random() * 30)-15; // make sure first card has readable rotation
    

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

    console.log(card);
    

    // It is VERY possible to clean this up
    // expecially the current player calls.

    
    state.updateGame(prev =>{
        const newState = {...prev};
        // MOVE EVERYTHING HERE
        newState.isUnoCallPossible = false;

        // Remove card from player's hand
        newState.discard = [card, ...newState.discard];
        
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

    return true; // Card played successfully
}

export function UnoFinishTurn(state: GameState & {updateGame: UpdateGame}) {
    // Next player's turn
    setNextPlayer(state);

    // Check if next player is skipped
    if(state.players[state.currentPlayer!].isSkipped) {

        state.updateGame(prev => {
            prev.players[prev.currentPlayer!].isSkipped = false;
            return prev;
        })

        setNextPlayer(state);
    }
}

export function checkCards(state: GameState & {updateGame: UpdateGame}): Card[] | false {

    const playableCards = state.players[state.currentPlayer!].hand.filter(card => {
        return UnoCheckCard(state, card);
    });

    if(playableCards.length === 0) {
        return false
    }

    return playableCards;
}
 

export function botTurn(state: GameState & {updateGame: UpdateGame}){
    const playableCards = checkCards(state);

    if(playableCards){
        const card = playableCards[Math.floor(Math.random() * playableCards.length)];
        UnoPlayCard(state, card);
    } else {
        pickUp(state, state.currentPlayer!, 1);
    }

    UnoFinishTurn(state);
}

export function pickUp(state:GameState & {updateGame: UpdateGame}, targetIndex:number, quantity: number){
    state.updateGame(prev => {
        const newState = {...prev};
        
        const drawn = newState.deck.slice(0, quantity) // dont use splice
        newState.players[targetIndex].hand = [...newState.players[targetIndex].hand, ...drawn];

        return newState;
    })
}

function skipNextPlayer(state: GameState & {updateGame: UpdateGame}){
    state.updateGame(prev => {
        const newState = {...prev};

        const skippedPlayer = newState.players[getNextPlayer(newState)];
        skippedPlayer.isSkipped = true;

        console.log(skippedPlayer.name, "was skipped");
    
        return newState;
    })
}


function getNextPlayer(state: GameState): number{
    if(state.direction){ // clockwise
        return state.players.indexOf(state.players[(state.currentPlayer! + 1) % state.players.length])
    }
    else{ // counter clockwise
        return state.players.indexOf(state.players[(state.currentPlayer! + (state.players.length - 1)) % state.players.length])
    }

}

export function setInitialPlayer(state:GameState & {updateGame: UpdateGame}){
    state.updateGame(prev => {
        const newState = {...prev};

        prev.currentPlayer = 0;
        prev.players[prev.currentPlayer].isTurn = true;
        return newState;
    })

}

function setNextPlayer(state: GameState & {updateGame: UpdateGame}){  
    state.updateGame(prev => {
        const newState = {...prev};
        
        // set current player to false
        newState.players[newState.currentPlayer!].isTurn = false;


        // set next player attributes
        newState.currentPlayer = getNextPlayer(newState);
        newState.players[newState.currentPlayer!].isTurn = true;



        return newState;
    })  
}