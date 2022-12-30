import React, { useContext, useEffect, useState } from 'react';
import { setInitialPlayer } from '../../game/uno';
import { GameContext } from '../../providers/GameProvider';

import Styles from './GameBoard.module.css';

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
        <div className={Styles.BoardWrapper}>

            <div className={Styles.InnerBoardWrapper}>
                <div className={`${Styles.InnerBoardBorder} ${game.discard[0].color} ${game.direction}`} >
                    <div className={Styles.InnerBoard}>
                        <div className={Styles.DiscardWrapper}>
                            {
                                game.discard
                                .slice(0)
                                .reverse()
                                .map((card, index) => {
                                    return <GameCard key={index} discard={true} card={card}></GameCard>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className={`${Styles.HandWrapper} ${game.currentPlayer === 0 && Styles.ActivePlayer}`}>
                <Hand show={true} player={0}/>
            </div>

            <div className={`${Styles.TopHandWrapper} ${game.currentPlayer === 2 && Styles.ActivePlayer}`}>
                <Hand show={false} player={2}/>
            </div>

            <div className={`${Styles.RightHandWrapper} ${game.currentPlayer === 3 && Styles.ActivePlayer}`}>
            <Hand show={false} player={3}/>

            </div>

            <div className={`${Styles.LeftHandWrapper} ${game.currentPlayer === 1 && Styles.ActivePlayer}`}>
            <Hand show={false} player={1}/>
            </div>
        </div>
    )
}