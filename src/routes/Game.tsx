import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GameContext, GameProvider } from '../providers/GameProvider';
import { SettingsContext } from '../providers/SettingsProvider';
import { SocketContext } from '../providers/SocketProvider';

import GameBoard from '../components/game/GameBoard';

type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
	const settings = useContext(SettingsContext);
	const socket = useContext(SocketContext);
	const uno = useContext(GameContext);

	useEffect(() => {
        
		socket.emit('create-sp-game', settings.username)
		if (title) {
		  document.title = title;
		} 
	  }, []);

	if(uno === undefined){
		return(
			<div>
				<h1>Loading...</h1>
			</div>
		)
	}
	else{		
		return(

			<GameBoard uno={uno!}/>
		)
	}
}

