import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GameState } from '../game/uno';

import { HiOutlineClipboardCopy } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';

import { SettingsContext } from '../providers/SettingsProvider';
import { RoomContext, SocketContext } from '../providers/SocketProvider';

import Styles2 from '../components/game/GameBoard.module.css';
import Styles from './Lobby.module.css';

import GameBoard from '../components/game/GameBoard';
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
    const room = useContext(RoomContext);
    const settings = useContext(SettingsContext);

	const redirect = useNavigate();

    const { gameID } = useParams<{ gameID: string }>();


    useEffect(() => {
        socket.emit('join', gameID, settings.username);
        socket.on('error', (msg) => {
			console.log(msg);
            redirect('/');
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

    const renderCards = (data: any) => {
        // this function is awful. But works so...
        let cards = [];

        for (let i = 0; i < 4; i++) {
            if(data){
                cards.push(
                    <LobbyCard 
                        key={i}
                        name={data[i]?.['name']} 
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


    if (room) {
        if(room.inLobby){
            return(
                <div className={Styles.Lobby}>
                    <div className={Styles.PlayerCards}>
                        {renderCards(room.clients!)}
                    </div>
    
                    <div className={Styles.RoomCode}>
                        <p>{room.roomID}</p>
                        <HiOutlineClipboardCopy 
                            className={Styles.CopyIcon} 
                            onClick={() => navigator.clipboard.writeText(room.roomID!)}
                        />
                    </div>
    
                    <div className={`${Styles.ActionWrapper} ${room.clients!.length >= 2 && 'active'}`}>
                        {
                            (socket.id === room.host) ?
                                (room.clients!.length >= 2) ? 
                                    <div className={Styles2.UnoButton} onClick={() => socket.emit('start-game', gameID)}>
                                        <div className={Styles2.UnoButtonCircle}/>
                                        <h1 className={Styles2.SelectButton}>PLAY</h1>
                                    </div>
                                :
                                    <p>waiting for players...</p>
                            :
                                <p>waiting for leader...</p>
                        }
                    </div>
                    
                    <ImExit 
                        className={Styles.ExitIcon}    
                        onClick={() => redirect('/')}
                    />
                </div>
            )
        }
        else if(room.game){
            return(
                <GameBoard uno={room.game!} roomID={room.roomID}/>
            )
        }
    } 

    return(
        <p></p> // Data error / loading
    )
}