import React, { useContext, useEffect, useState } from 'react';
import { botTurn, checkCards, pickUp, setInitialPlayer, UnoFinishTurn } from '../../game/uno';
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

    useEffect(() => { 
        if (game.currentPlayer !== null){
            if(game.players[game.currentPlayer!].type === 'bot'){
                console.log(game.players[game.currentPlayer!].name,'\'s turn');
                
                setTimeout(() => {
                    botTurn(game);
                }, 1000);
                
            }
            else if(game.players[game.currentPlayer!].type === 'local'){
                console.log('player turn');
                console.log(checkCards(game));
                
                if(!checkCards(game)){
                    console.log('player has to pick up');
                    
                    pickUp(game, game.currentPlayer!, 1);
                    UnoFinishTurn(game);
                }
            }
            else{
                console.error('invalid player type');
            }
        }


    }, [game.currentPlayer])

    useEffect(() => {
        if(game.askForColor){
            console.log('ask for color');
        }
    }, [game.askForColor])

    
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