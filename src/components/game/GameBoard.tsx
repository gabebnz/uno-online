import React, { useContext, useEffect } from 'react';
import { setInitialPlayer } from '../../game/uno';
import { GameContext } from '../../providers/GameProvider';

import styles from './GameBoard.module.css';

import GameCard from './Card';
import Hand from './Hand';

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
                    <GameCard key={Math.random()} display={true} card={game.discard[0]}></GameCard>
                </div>
            </div>

            <div className={styles.HandWrapper}>
                <Hand show={true} player={0}/>
            </div>

            <div className={styles.TopHandWrapper}>
                <Hand show={false} player={2}/>
            </div>

            <div className={styles.RightHandWrapper}>
            <Hand show={false} player={3}/>

            </div>

            <div className={styles.LeftHandWrapper}>
            <Hand show={false} player={1}/>
            </div>
        </div>
    )
}