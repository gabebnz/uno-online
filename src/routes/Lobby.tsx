import React, { useContext, useEffect, useState } from 'react';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { GameState } from '../game/uno';
import { SocketContext } from '../providers/SocketProvider';
import Styles from './Lobby.module.css';

import LobbyCard from '../components/LobbyCard';

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


export default function Lobby({ title } : Props ) {
    const socket = useContext(SocketContext);

    const { gameID } = useParams<{ gameID: string }>();
    const [roomData, setRoomData] = useState<RoomState>();

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
                <div className={Styles.PlayerCards}>
                    <LobbyCard name={roomData.clients[0]} card={1}/>
                    <LobbyCard name={roomData.clients[1]} card={2}/>
                    <LobbyCard name={roomData.clients[2]} card={3}/>
                    <LobbyCard name={roomData.clients[3]} card={4}/>
                </div>

                <div className={Styles.RoomCode}>
                    <p>{roomData.roomID}</p>
                    <HiOutlineClipboardCopy 
                        className={Styles.CopyIcon} 
                        onClick={() => navigator.clipboard.writeText(roomData.roomID)}
                    />
                </div>

                <a href="">start</a>

            </div>
        )
    } 
    else {
        return(
            <p></p>  
        )
    }
}