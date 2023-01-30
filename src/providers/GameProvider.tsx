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
    const socket = useContext(SocketContext);

    useEffect(() => {
        if(
            uno.playing &&
            uno.players[uno.currentPlayer!].type === 'bot' && 
            uno.players[uno.currentPlayer!].socketID !== socket.id
            ){
            const cardDelay = setTimeout(() => {
                socket.emit('bot-turn')
            }, Math.floor(Math.random() * 1000)+1000);

            const finishDelay = setTimeout(() => {
                socket.emit('finish-turn')
            }, 2600); 
            // This timeout value must be longer than the max 
            // card timeout + bot color choose timeout
            
            return () => {
                clearTimeout(cardDelay);
                clearTimeout(finishDelay);
            };
        }
    }, [uno.currentPlayer])

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