import React, { useReducer } from 'react';
import { GameContext } from '../providers/GameProvider';
import { type Card } from './deck';
import { botTurn, callUno, finishTurn, newGame, pickupCard, playCard, setColor, setUnoCallPossible, startTimer, type GameState } from './uno';

export type UnoAction = {
    type: 'newGame'
} | {
    type: 'playCard', card: Card
} | {
    type: 'pickupCard', targetPlayer: number, quantity: number
} | {
    type: 'setColor', color: string
} | {
    type: 'finishTurn' 
} | {
    type: 'startTimer', playerIndex: number
} | {
    type: 'botTurn'
} | {
    type: 'callUno', playerIndex: number
} | {
    type: 'setUnoCallPossible', playerIndex: number
};

export const UnoReducer = (state: GameState, action: UnoAction): GameState => {

    function cloneUno(state:GameState):GameState{
        return {...state}
    }

    state = cloneUno(state);
    
    switch(action.type){
        case 'newGame':
            return newGame();
        case 'playCard':
            return playCard(state, action.card);
        case 'pickupCard':
            return pickupCard(state, action.targetPlayer, action.quantity);
        case 'setColor':
            return setColor(state, action.color);
        case 'finishTurn':
            return finishTurn(state);
        case 'startTimer':
            return startTimer(state, action.playerIndex);
        case 'botTurn':
            return botTurn(state);
        case 'callUno':
            return callUno(state, action.playerIndex);
        case 'setUnoCallPossible':
            return setUnoCallPossible(state, action.playerIndex);
    }
}