import React, { useContext, useEffect, useState } from 'react';
import { checkPlayableCards, setInitialPlayer } from '../../game/uno';
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
        //setInitialPlayer(uno); // THIS IS BAD! ----------------------
    }, []);

    useEffect(() => { 
        
        if(uno.players[uno.currentPlayer!].isSkipped === true){
            // also flash color for skipped player todo:::------
            setTimeout(() => {
                dispatch({
                    type: 'finishTurn',
                });
            }, Math.floor(Math.random() * 1000));
        }
        

        if (uno.currentPlayer !== null){
            if(uno.players[uno.currentPlayer!].type === 'bot'){
                
                setTimeout(() => {
                    dispatch({
                        type: 'botTurn',
                    });

                    if(uno.askForColor){
                        dispatch({
                            type: 'setColor',
                            color: uno.players[uno.currentPlayer!].hand[0].color,
                        });
                    }
                    
                    dispatch({
                        type: 'finishTurn',
                    });
                }, Math.floor(Math.random() * 1000) + 1500);


            }
            else if(uno.players[uno.currentPlayer!].type === 'local'){
                if(!checkPlayableCards(uno)){ // no playable cards
                    console.log('no playable cards');
                    setTimeout(() => {
                        dispatch({
                            type: 'pickupCard',
                            targetPlayer: uno.currentPlayer,
                            quantity: 1
                        });
                    }, 1000);

                }
            }
            else{
                console.error('invalid player type');
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


    useEffect(() => {
        if(!uno.askForColor){
            dispatch({
                type: 'finishTurn',
            });
        }
    }, [uno.discard])


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
				uno.askForColor && (
					<div className={Styles.ColorSelect}>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('red')}>Red</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('blue')}>Blue</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('green')}>Green</button>
						<button className={Styles.SelectButton} onClick={() => handleColorSelect('yellow')}>Yellow</button>
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