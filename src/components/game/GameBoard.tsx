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
    const [glowColor, setGlowColor] = useState('');

    useEffect(() => {
        setInitialPlayer(game);
    }, []);

    useEffect(() => { 
        if (game.currentPlayer !== null){
            if(game.players[game.currentPlayer!].type === 'bot'){
                
                setTimeout(() => {
                    botTurn(game);
                }, 1000);
                
            }
            else if(game.players[game.currentPlayer!].type === 'local'){
                if(!checkCards(game)){
                    
                    setTimeout(() => {
                        pickUp(game, game.currentPlayer!, 1);
                        UnoFinishTurn(game);
                    }, 1000);
                    
                }
            }
            else{
                console.error('invalid player type');
            }
        }
    }, [game.currentPlayer])

    useEffect(() => {

        switch (game.currentColor) {
            case 'red':
                setGlowColor(Styles.RedGlow);
                break;
            case 'blue':
                setGlowColor(Styles.BlueGlow);
                break;
            case 'green':
                setGlowColor(Styles.GreenGlow);
                break;
            case 'yellow':
                setGlowColor(Styles.YellowGlow);
                break;
            default:
                setGlowColor(Styles.DefaultGlow);
                break;
        }

        if(game.currentColor === 'wild'){ 
            // dont reset when color is wild
            // as the player will have to choose another color
            setGlowColor(Styles.WildGlow);
        }
        else{ // if color is not wild, reset glow after 500ms
            setTimeout(() => {
                setGlowColor(Styles.DefaultGlow);
    
            }, 500);
        }

        



    }, [game.currentColor])

    useEffect(() => {
        if(game.askForColor){
            console.log('ask for color');
        }
    }, [game.askForColor])

    
    return (
        <div className={Styles.BoardWrapper}>

            <div className={Styles.InnerBoardWrapper}>
                <div className={`${Styles.InnerBoardBorder} ${glowColor} ${game.discard[0].color} ${game.direction}`} >


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