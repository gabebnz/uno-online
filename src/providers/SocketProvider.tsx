import React, { createContext, useEffect, useState } from 'react';

import io, { type Socket } from 'socket.io-client';
import { GameState } from '../game/uno';

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
const socket = io('http://localhost:4000'); 
export const SocketContext = createContext<Socket>(socket);

type UpdateRoomState = React.Dispatch<React.SetStateAction<RoomState | undefined>>;

export const RoomContext = createContext<RoomState & {updateRoom: UpdateRoomState}>({updateRoom: () => undefined});

export const RoomProvider: React.FC<GameProviderProps> = (props) => {
    const [room, setRoom] = useState<RoomState | undefined>(); // Multiplayer room instance


    useEffect(() => {
        socket.on('message', (msg) => {
            console.log(msg);
        });

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