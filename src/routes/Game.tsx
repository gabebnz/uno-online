import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { GameContext, GameProvider } from '../providers/GameProvider';


type Props = {
	title?: string,
}

export default function Game({ title} : Props ) {
    const { gameID } = useParams<{ gameID: string }>();
	const game = useContext(GameContext)

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
        <GameProvider>
			<>
				<p>GameState: {game.direction? 'true' : 'false'}</p>
			</>
        </GameProvider>
	)
}