import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GameCard from '../components/game/Card';
import GameBoard from '../components/game/GameBoard';

import Layout from '../components/Layout';
import { GameContext, GameProvider } from '../providers/GameProvider';


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
        <GameProvider>
			<GameBoard />
        </GameProvider>
	)
}

