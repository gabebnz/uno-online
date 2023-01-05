import React, { useContext, useEffect, useState } from 'react';
import { checkPlayableCards } from '../../game/uno';
import { GameContext, GameDispatchContext } from '../../providers/GameProvider';

import styles from './Card.module.css';

import { Card } from '../../game/deck';


interface  CardProps {
    card: Card
    show?: boolean
    discard?: boolean
    children?: React.ReactNode
}

export default function GameCard({ card, show, discard }: CardProps){
    const uno = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);
    
    const cardColor = card?.color

    const handleCardClick = () => {
        dispatch({
            type: 'playCard',
            card: card,
        })

        const possibleCards = checkPlayableCards(uno);
        if( !uno.askForColor 
            && uno.currentPlayer === 0 
            && (possibleCards && possibleCards.indexOf(card)) !== -1){
            dispatch({
                type: 'finishTurn',
            });
        }
    }

    const innerCard = 
        <>
            <div className={styles.TopLeft}>
                <h1>{card.value}</h1>
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            <div className={styles.Middle}>
                {
                    !(card.value === "reverse" || card.value === "wild" || card.value === "skip") && <h1>{card.value}</h1>
                }
                
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            <div className={styles.BotRight}>
                <h1>{card.value}</h1>
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            
        </>

    if(discard && card){ // DISCARD PILE
        return(
            <div className={`${styles.RotationWrapper} ${card.playedBy}`}>
                <div 
                    className={`${styles.CardWrapper} ${styles.Discard} ${styles[cardColor!]}`}
                    style={{rotate:`${card.rotation}deg`, translate:`${card.offsetX}px ${card.offsetY}px`}}
                >
                    {innerCard}
                </div>
            </div>
        )
    }
    else if(!show){ // CARD BACKSIDE
        return(
            <div className={`${styles.CardWrapper} ${styles.HandCard}`}>
                <h1>UNO</h1>
            </div>
        )
    }
    else if (card){ // LOCAL PLAYERS HAND
        return(
            <div 
                className={`${styles.CardWrapper} ${styles.HandCard} ${styles[cardColor!]} ${uno.currentPlayer === 0 && styles.Selectable}`} 
                onClick={() => (uno.currentPlayer === 0 && uno.players[uno.currentPlayer].isSkipped === false) && handleCardClick()}
            >
                {innerCard}
            </div>
        )
    }
    else{
        return(
            <p>INVALID CARD TYPES</p>
        )}
}