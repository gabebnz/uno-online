import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState, UnoInitialState } from '../game/uno';
import { SettingsContext } from './SettingsProvider';


type UpdateGame = React.Dispatch<React.SetStateAction<GameState>>

export const GameContext = createContext<GameState & {updateGame: UpdateGame}>({...UnoInitialState, updateGame: () => undefined});

interface GameProviderProps {
    children?: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = (props) => {
    const settings = useContext(SettingsContext);
    const [game, setGame] = useState<GameState>(UnoInitialState);
    
    useEffect(()=>{ 
        // Weird function where i have to set username state here, cant do it in init method
        const players = [...game.players]
        let player = {
            ...players[0],
            name: settings.username
        }

        players[0] = player;

        setGame({...game, players});
    }, []);

    // Here we can write the useEffect functions to store the game state locally

    return(
        <GameContext.Provider value={{...game, updateGame: setGame}}>
            {props.children}
        </GameContext.Provider>
    )
}