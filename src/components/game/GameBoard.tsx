import React, { useContext } from 'react';
import { GameContext } from '../../providers/GameProvider';

import styles from './GameBoard.module.css';

import GameCard from './Card';

interface Props {
    children?: React.ReactNode;
}

export default function GameBoard({ children }: Props) {
    const game = useContext(GameContext)

    return (
        <>
            <div className={`${styles.InnerBoardBorder} ${game.discard[0].color} ${game.direction}`} >
                <div className={styles.InnerBoard}>
                    <GameCard card={game.discard[0]}></GameCard>
                </div>
            </div>



            {
                /*game?.players[0].hand.map((card, index) => {
                    return <GameCard key={index} card={card}>{card.value}</GameCard>
                })*/
            }
            {children}
        </>
    )
}