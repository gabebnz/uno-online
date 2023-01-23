import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GameState } from '../game/uno';
import { SocketContext } from '../providers/SocketProvider';
import Styles from './Lobby.module.css';

type Props = {
	title?: string,
}

// Lobby data structure, make sure server has same interface
interface RoomState {
  roomID: string;

  clients: string[];
  host: string;

  game: GameState | null;
  inLobby: boolean;
}

const testData = {
    roomID: 'uno-j5I0Le',
    clients: ['test1', 'test2'],
    host: 'test1',
    game: null,
    inLobby: true
}

export default function Lobby({ title } : Props ) {
    const socket = useContext(SocketContext);

    const { gameID } = useParams<{ gameID: string }>();
    const [roomData, setRoomData] = useState<RoomState>(testData);

    useEffect(() => {
        socket.emit('join', gameID);

        socket.on('message', (msg) => {
            console.log(msg);
        });

        socket.on('data', (data) => {
            setRoomData(data)
        })

		return () => {
            socket.emit('leave', gameID);
            socket.off('connect');
			socket.off('disconnect');
		}
	}, []);

    // doc title
	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

    if (roomData) {
        return(
            <div className={Styles.Lobby}>
                <h1>Lobby</h1>
                <p>Users in room: {roomData.clients.length}</p>
                <p>Game code: {gameID}</p>
                <p>My id: {socket.id}</p>
            </div>
        )
    } 
    else {
        return(
            <h1>no data...</h1>  
        )
    }
}