import React, { useContext, useEffect, useState } from 'react';
import { ScrollRestoration } from 'react-router-dom';
import { Card } from '../../game/deck';
import { UnoFinishTurn, UnoPlayCard } from '../../game/uno';
import { GameContext } from '../../providers/GameProvider';
import styles from './Card.module.css';

interface  CardProps {
    card: Card
    show?: boolean
    discard?: boolean
    children?: React.ReactNode
}

export default function GameCard({ card, show, discard }: CardProps){
    const game = useContext(GameContext);
    const cardColor = card?.color

    const [canfinish, setCanFinish] = useState(game.askForColor)

    useEffect(() => {
        setCanFinish(game.askForColor)
    }, [game.askForColor])
    

    const handleCardClick = () => {
        UnoPlayCard(game, card!) && UnoFinishTurn(game);
    }

    if(discard && card){ // discard pile
        return(
            <div 
                className={`${styles.CardWrapper} ${styles.Discard} ${styles[cardColor!]}`}
                style={{rotate:`${card.rotation}deg`, translate:`${card.offsetX}px ${card.offsetY}px`}}
            >
                <h1>{card.value}</h1>
            </div>
        )
    }
    else if(!show){
        return(
            <div className={`${styles.CardWrapper} ${styles.HandCard}`}>
                <p>UNO</p>
            </div>
        )
    }
    else if (card){ // LOCAL PLAYERS HAND
        return(
            <div 
                className={`${styles.CardWrapper} ${styles.HandCard} ${styles[cardColor!]} ${game.currentPlayer === 0 && styles.Selectable}`} 
                onClick={() => game.currentPlayer === 0 && handleCardClick()}
            >
                <p>{card.type}</p>
                <p>{card.value}</p>
            </div>
        )
    }
    else{
        return(
            <p>INVALID CARD TYPES</p>
        )}
}