import React, { useContext } from 'react';
import { Card } from '../../game/deck';
import { UnoPlayCard } from '../../game/uno';
import { GameContext } from '../../providers/GameProvider';
import styles from './Card.module.css';

interface  CardProps {
    card?: Card
    show?: boolean
    display?: boolean
    children?: React.ReactNode
}

export default function GameCard({ card, show, display }: CardProps){
    const game = useContext(GameContext);
    const cardColor = card?.color

    const handleCardClick = () => {
        UnoPlayCard(game, card!)
    }


    if(display && card){
        return(
            <div className={`${styles.CardWrapper} ${styles[cardColor!]}`}>
                <p>{card.type}</p>
                <p>{card.value}</p>
            </div>
        )
    }
    else if(!show){
        return(
            <div className={`${styles.CardWrapper}`}>
                <p>UNO</p>
            </div>
        )
    }
    else if (card){ // LOCAL PLAYERS HAND
        return(
            <div className={`${styles.CardWrapper} ${styles[cardColor!]} ${styles.Selectable}`} onClick={() => handleCardClick()}>
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