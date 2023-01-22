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
    const [uno, dispatch] = useReducer(UnoReducer, UnoInitialState);

    return(
        <GameContext.Provider value={uno}>
            <GameDispatchContext.Provider value={dispatch}>
                {props.children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    )
}