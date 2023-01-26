import React, { createContext, useState } from 'react';

import io, { type Socket } from 'socket.io-client';
import { UnoReducer } from '../game/reducer';
import { GameState, UnoInitialState } from '../game/uno';

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

const RoomInitialState: RoomState = {
    roomID: undefined,
    clients: undefined,
    host: undefined,
    game: undefined,
    inLobby: undefined,
}


// Connection to server, does not update/change
const socket = io('http://localhost:4000'); 
export const SocketContext = createContext<Socket>(socket);


type UpdateGameState = React.Dispatch<React.SetStateAction<GameState>>;
type UpdateRoomState = React.Dispatch<React.SetStateAction<RoomState>>;

export const GameContext = createContext<GameState & {updateGame: UpdateGameState}>({...UnoInitialState, updateGame: () => undefined});
export const RoomContext = createContext<RoomState & {updateRoom: UpdateRoomState}>({...RoomInitialState, updateRoom: () => undefined});


export const GameProvider: React.FC<GameProviderProps> = (props) => {
    const [room, setRoom] = useState<RoomState>(RoomInitialState); // Multiplayer room instance
    const [uno, setUno] = useState<GameState>(UnoInitialState); // Singleplayer game instance

    return(
        <GameContext.Provider value={{...uno, updateGame: setUno}}>
            <RoomContext.Provider value={{...room, updateRoom: setRoom}}>
                {props.children}
            </RoomContext.Provider>
        </GameContext.Provider>
    )
}