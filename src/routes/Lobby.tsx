import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';
import { useParams } from 'react-router-dom';
import Styles2 from '../components/game/GameBoard.module.css';
import { GameState } from '../game/uno';
import { SettingsContext } from '../providers/SettingsProvider';
import { SocketContext } from '../providers/SocketProvider';
import Styles from './Lobby.module.css';


import LobbyCard from '../components/LobbyCard';

type Props = {
	title?: string,
}

// Lobby data structure, make sure server has same interface
interface RoomState {
  roomID: string;

  clients: [] | undefined;
  host: string;

  game: GameState | null;
  inLobby: boolean;
}

export default function Lobby({ title } : Props ) {
    const socket = useContext(SocketContext);
    const settings = useContext(SettingsContext);
	const redirect = useNavigate();


    const { gameID } = useParams<{ gameID: string }>();
    const [roomData, setRoomData] = useState<RoomState>();

    useEffect(() => {
        socket.emit('join', gameID, settings.username);

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

    const renderCards = (data: RoomState) => {
        // this function is awful. But works so...
        let cards = [];

        for (let i = 0; i < 4; i++) {
            if(data.clients){
                cards.push(
                    <LobbyCard 
                        key={i}
                        name={data.clients[i]?.['name']} 
                        card={i+1} 
                    />
                )
            }
            else{
                cards.push(
                    <LobbyCard 
                        key={i}
                        name={undefined} 
                        card={i+1} 
                    />
                )
            }
        }
        return cards;
    }


    if (roomData) {
        return(
            <div className={Styles.Lobby}>
                <div className={Styles.PlayerCards}>
                    {renderCards(roomData)}
                </div>

                <div className={Styles.RoomCode}>
                    <p>{roomData.roomID}</p>
                    <HiOutlineClipboardCopy 
                        className={Styles.CopyIcon} 
                        onClick={() => navigator.clipboard.writeText(roomData.roomID)}
                    />
                </div>

                <div className={`${Styles.ActionWrapper} ${roomData.clients!.length >= 2 && 'active'}`}>
                    {
                        (socket.id === roomData.host) ?
                            (roomData.clients!.length >= 2) ? 
                                <div className={Styles2.UnoButton} onClick={() => alert()}>
                                    <div className={Styles2.UnoButtonCircle}/>
                                    <h1 className={Styles2.SelectButton}>PLAY</h1>
                                </div>
                            :
                                <p>waiting for players...</p>
                        :
                            <p>waiting for host...</p>
                    }
                </div>
                
                <ImExit 
                    className={Styles.ExitIcon}    
                    onClick={() => redirect('/')}
                />
            </div>
        )
    } 
    else {
        return(
            <p></p>  
        )
    }
}