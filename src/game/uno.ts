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
        currentPlayer: 0,
        deck: shuffledDeck,
        discard: [shuffledDeck.pop() as Card], // turnover first card
        direction: true, 

        askForColor: false,
        currentColor: 'wild',

        isUnoCallPossible: false,
        wasUnoCalled: false,

        winner: null,
        playing: false,
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

    state.isUnoCallPossible = false;

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
        state.isUnoCallPossible = true;
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

    return state;
}

function skipPlayer(state:GameState): GameState {
    const skippedPlayer = state.players[getNextPlayer(state)];
    skippedPlayer.isSkipped = true;

    console.log(skippedPlayer.name, "should be skipped");

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

    if(state.players[state.currentPlayer!].isSkipped){
        state.players[state.currentPlayer!].isSkipped = false;
    }

    if(!state.askForColor){
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

    if(playableCards){
        const card = playableCards[Math.floor(Math.random() * playableCards.length)];
        playCard(state, card);
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













// Maybe export this so we can check before playing card method...?
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
                const newState = {...prev}
                newState.askForColor = true;
                return newState;
            })
            
            break;
        case 'wild':
            state.updateGame(prev => {
                const newState = {...prev}
                newState.askForColor = true;
                return newState;
            })
            break;
        default:
            break;
    }

    console.log(state.askForColor);
    
    return true; // Card played successfully
}




 



export function pickUp(state:GameState & {updateGame: UpdateGame}, targetIndex:number, quantity: number){
    state.updateGame(prev => {
        const newState = {...prev};
        
        const drawn = newState.deck.splice(0, quantity)
        newState.players[targetIndex].hand = [...newState.players[targetIndex].hand, ...drawn];

        console.log("deck: ", newState.deck)

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




export function setInitialPlayer(state:GameState){
    state.currentPlayer = 0;
    state.players[state.currentPlayer].isTurn = true;

    state.currentColor = state.discard[0].color;

    return state;
}

