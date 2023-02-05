import React, { createContext, useEffect, useState } from 'react';

import io, { type Socket } from 'socket.io-client';
import { GameState } from '../../../shared/types';

interface RoomState { // Room data structure, make sure server has same interface
    roomID?: string;
    clients?: Client[];
    host?: string;
    game?: GameState;
    inLobby?: boolean;
}

interface Client{
    id: string;
    name: string;
}
 
interface GameProviderProps {
    children?: React.ReactNode;
}

// Connection to server, does not update/change
const socket = io('https://uno-server-uc8m.onrender.com', {
    transports: ["websocket", "polling"]
}); 

socket.on("connect_error", () => {
    // revert to classic upgrade
    socket.io.opts.transports = ["polling", "websocket"];
});

export const SocketContext = createContext<Socket>(socket);

type UpdateRoomState = React.Dispatch<React.SetStateAction<RoomState | undefined>>;
export const RoomContext = createContext<RoomState & {updateRoom: UpdateRoomState}>({updateRoom: () => undefined});

export const RoomProvider: React.FC<GameProviderProps> = (props) => {
    const [room, setRoom] = useState<RoomState | undefined>(); // Multiplayer room instance

    useEffect(() => {
        if( // Room host controls bot turns
            socket.connected &&
            room?.game?.playing &&
            room?.host === socket.id &&
            room.game.players[room.game.currentPlayer!].socketID !== socket.id &&
            room?.game?.players[room.game.currentPlayer!].type === 'bot' 
            ){                    
            const cardDelay = setTimeout(() => {
                socket.emit('bot-turn', room.roomID)
            }, Math.floor(Math.random() * 1000)+1000);

            const finishDelay = setTimeout(() => {
                socket.emit('finish-turn', room.roomID)
            }, 2600); 
            // This delay value must be longer than the max 
            // card delay + bot color choose delay

            return () => {
                clearTimeout(cardDelay);
                clearTimeout(finishDelay);
            };
        }
    }, [room?.game?.currentPlayer])

    // Data in from server
    useEffect(() => {
        socket.on('data', (data) => {
            setRoom(data)
        })



	}, []);

    return(
        <RoomContext.Provider value={{...room, updateRoom: setRoom}}>
            {props.children}
        </RoomContext.Provider>
    )
}