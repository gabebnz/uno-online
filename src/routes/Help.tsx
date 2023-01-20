import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GameBoard from '../components/game/GameBoard';

type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
    const { gameID } = useParams<{ gameID: string }>();

	//Todo: multiplayer

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<h1>Help / About</h1>
	)
}

