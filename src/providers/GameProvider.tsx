import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { UnoReducer } from '../game/reducer';
import { GameState, UnoInitialState } from '../game/uno';
import { SettingsContext } from './SettingsProvider';


export type UpdateGame = React.Dispatch<React.SetStateAction<GameState>>

export const GameContext = createContext<GameState>(UnoInitialState);
export const GameDispatchContext = createContext<React.Dispatch<any>>(() => {});

interface GameProviderProps {
    children?: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = (props) => {
    const settings = useContext(SettingsContext);

    const [uno, dispatch] = useReducer(UnoReducer, UnoInitialState);
    
    


    // Here we can write the useEffect functions to store the game state locally

    return(
        <GameContext.Provider value={uno}>
            <GameDispatchContext.Provider value={dispatch}>
                {props.children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    )
}