import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GameBoard from '../components/game/GameBoard';

type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
    const { gameID } = useParams<{ gameID: string }>();

	// THIS CAN BE THE SINGLEPLAYER GAME LOGIC 

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<GameBoard />
	)
}

