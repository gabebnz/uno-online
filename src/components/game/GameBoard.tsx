import React, { useContext, useEffect } from 'react';
import { setInitialPlayer } from '../../game/uno';
import { GameContext } from '../../providers/GameProvider';

import styles from './GameBoard.module.css';

import GameCard from './Card';

interface Props {
    children?: React.ReactNode;
}

export default function GameBoard({ children }: Props) {
    const game = useContext(GameContext)

    useEffect(() => {
        setInitialPlayer(game);
    }, []);

    
    return (
        <div className={styles.BoardWrapper}>

            <div className={`${styles.InnerBoardBorder} ${game.discard[0].color} ${game.direction}`} >
                <div className={styles.InnerBoard}>
                    <GameCard card={game.discard[0]}></GameCard>
                </div>
            </div>

            <div className={styles.HandWrapper}>
                {
                    game?.players[0].hand.map((card, index) => {
                        return <GameCard key={index} card={card}>{card.value}</GameCard>
                    })
                }
            </div>

            <div className={styles.TopHandWrapper}>
                {/*
                    game?.players[1].hand.map((card, index) => {
                        return <GameCard key={index} card={card}>{card.value}</GameCard>
                    })
                */}
            </div>
        </div>
    )
}