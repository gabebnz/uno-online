import React, { createContext, useEffect, useState } from 'react';
import { GameState, UnoInitialState } from '../game/uno';


interface GameProviderProps {
    children?: React.ReactNode;
    roomID?: string;
}

type UpdateGameState = React.Dispatch<React.SetStateAction<GameState>>;
export const GameContext = createContext<GameState & {updateGame: UpdateGameState}>({...UnoInitialState, updateGame: () => undefined});

export const GameProvider: React.FC<GameProviderProps> = (props) => {
    const [uno, setUno] = useState<GameState>(UnoInitialState); 

    return(
        <GameContext.Provider value={{...uno, updateGame: setUno}}>
                {props.children}
        </GameContext.Provider>
    )
}