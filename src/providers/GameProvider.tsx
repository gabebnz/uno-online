import React, { createContext, useContext, useEffect, useState } from 'react';
import { Card } from '../game/deck';
import { GameState, PlayerState, UnoInitialState } from '../game/uno';
import { SettingsContext } from './SettingsProvider';
import { SocketContext } from './SocketProvider';

interface GameProviderProps {
    children?: React.ReactNode;
    roomID?: string;
}

export const GameContext = createContext<GameState | null>(null);

export const GameProvider: React.FC<GameProviderProps> = (props) => {
    const [uno, setUno] = useState<GameState>(UnoInitialState); 
    const settings = useContext(SettingsContext);
    const socket = useContext(SocketContext);


	useEffect(() => {
        socket.on('data-sp', (data) => {            
            setUno(data)
        })
	}, []);


    return(
        <GameContext.Provider value={{...uno}}>
                {props.children}
        </GameContext.Provider>
    )
}