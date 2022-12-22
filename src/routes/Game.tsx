import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameCard from '../components/game/Card';
import Layout from '../components/Layout';
import { GameContext, GameProvider } from '../providers/GameProvider';


type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
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
				{game.discard.at(-1)?.color}
				{
					game?.players[0].hand.map((card, index) => {
						return <GameCard key={index} card={card}>{card.value}</GameCard>
					})
				}
					

				
			</>
        </GameProvider>
	)
}

