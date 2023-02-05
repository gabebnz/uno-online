import React, { useContext, useEffect } from 'react';

import { GameContext, GameProvider } from '../providers/GameProvider';
import { SettingsContext } from '../providers/SettingsProvider';
import { SocketContext } from '../providers/SocketProvider';

import GameBoard from '../components/game/GameBoard';
import Loader from '../components/Loader';

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
			<Loader /> // Data error / loading
		)
	}
	else{		
		return(

			<GameBoard uno={uno!}/>
		)
	}
}

