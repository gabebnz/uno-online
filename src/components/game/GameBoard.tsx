import React, { useContext, useEffect, useState } from 'react';
import { checkPlayableCards } from '../../game/uno';
import { GameContext, GameDispatchContext } from '../../providers/GameProvider';

import Styles from './GameBoard.module.css';

import GameCard from './Card';
import Hand from './Hand';

interface Props {
    children?: React.ReactNode;
}


export default function GameBoard({ children }: Props) {
    const uno = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);

    const [glowColor, setGlowColor] = useState('');

    useEffect(() => {
        if(uno.playing === false && uno.winner){
            console.log('game over');
            console.log('winner: ' + uno.winner);
        }
    }, [uno.playing]);

    useEffect(() => {
        dispatch({
            type: 'newGame',
        });
    }, []);

    // Turn logic
    useEffect(() => { 
        if(uno.playing){
            if(uno.players[uno.currentPlayer!].isSkipped === true){
                // also flash color for skipped player todo:::------
    
                const skipDelay = setTimeout(() => {
                    dispatch({
                        type: 'finishTurn',
                    });
                }, 1000);
    
                return () => {
                    clearTimeout(skipDelay);
                }
            }
            
    
            if (uno.currentPlayer !== null){
                
                // if player/bot has 2 cards left and one can be played, set unoCallPossible to true
                if(uno.players[uno.currentPlayer].hand.length === 2 && checkPlayableCards(uno)){
                    dispatch({ 
                        type: 'setUnoCallPossible',
                        playerIndex: uno.currentPlayer
                    });
                }
    
    
    
                if(uno.players[uno.currentPlayer!].type === 'bot'){
                    
                    const cardDelay = setTimeout(() => {
                        dispatch({
                            type: 'botTurn',
                        });
                    }, Math.floor(Math.random() * 500)+1000);
    
                    const finishDelay = setTimeout(() => {
                        dispatch({
                            type: 'finishTurn',
                        });
                    }, 2500);
    
                    return () => {
                        clearTimeout(cardDelay);
                        clearTimeout(finishDelay);
                    };
                }
                else if(uno.players[uno.currentPlayer!].type === 'local'){
                    // check for playable cards
                    if(!checkPlayableCards(uno)){ 
                        const pickupDelay = setTimeout(() => {
                            dispatch({
                                type: 'pickupCard',
                                targetPlayer: uno.currentPlayer,
                                quantity: 1
                            });
                        }, 1000);
    
                        const finishDelay = setTimeout(() => {
                            dispatch({
                                type: 'finishTurn',
                            });
                        }, 2500);
    
                        return () => {
                            clearTimeout(pickupDelay);
                            clearTimeout(finishDelay);
                        };
                    }
                }
                else{
                    console.error('invalid player type');
                }
            }
        }
        
    }, [uno.currentPlayer])


    useEffect(() => {

        switch (uno.currentColor) {
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

        if(uno.currentColor === 'wild'){ 
            // dont reset when color is wild
            // as the player will have to choose another color
            setGlowColor(Styles.WildGlow);
        }
        else{ // if color is not wild, reset glow after 500ms
            setTimeout(() => {
                setGlowColor(Styles.DefaultGlow);
    
            }, 500);
        }

    }, [uno.currentColor])





	function handleColorSelect(color:string){
		console.log('color selected: ' + color);
		
		dispatch({
            type: 'setColor',
            color: color
        });

		dispatch({
            type: 'finishTurn',
        });
	}

    function handleUnoCall(){
        dispatch({
            type: 'callUno',
            playerIndex: uno.currentPlayer!
        });
    }

    return (
        <div className={Styles.BoardWrapper}>
            <div className={Styles.InnerBoardWrapper}>
                <div className={`${Styles.InnerBoardBorder} ${glowColor} ${uno.discard[0].color} ${uno.direction}`} >
                    <div className={Styles.InnerBoard}>
                        <div className={Styles.DiscardWrapper}>
                            {
                                uno.discard
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

			{
				(uno.askForColor && uno.currentPlayer === 0) && (
					<div className={Styles.ColorSelect}>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('red')}>Red</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('blue')}>Blue</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('green')}>Green</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('yellow')}>Yellow</button>
					</div>
				)
			}

            {
                (
                    uno.players[0].isUnoCallPossible 
                    && !uno.players[0].isUno 
                ) 
                && (
                    <div className={Styles.UnoButtonWrapper}>
                        <button className={Styles.SelectButton} onClick={() => handleUnoCall()}>Call Uno!</button>
                    </div>
                )
            }

            <div className={`${Styles.HandWrapper} ${uno.currentPlayer === 0 && Styles.ActivePlayer}`}>
                <Hand show={true} player={0}/>
            </div>

            <div className={`${Styles.TopHandWrapper} ${uno.currentPlayer === 2 && Styles.ActivePlayer}`}>
                <Hand show={false} player={2}/>
            </div>

            <div className={`${Styles.RightHandWrapper} ${uno.currentPlayer === 3 && Styles.ActivePlayer}`}>
                <Hand show={false} player={3}/>
            </div>

            <div className={`${Styles.LeftHandWrapper} ${uno.currentPlayer === 1 && Styles.ActivePlayer}`}>
                <Hand show={false} player={1}/>
            </div>
        </div>
    )
}