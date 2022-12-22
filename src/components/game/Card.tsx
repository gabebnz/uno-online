import React, { useContext } from 'react';
import { Card } from '../../game/deck';
import { GameContext } from '../../providers/GameProvider';
import styles from './Card.module.css';

interface  CardProps {
    card: Card
    children?: React.ReactNode
}

export default function GameCard({ card }: CardProps){
    const game = useContext(GameContext);
    const cardColor = card.color
    
    return(
        <div className={`${styles.CardWrapper} ${styles[cardColor]}`}>
            <p>{card.type}</p>
            <p>{card.value}</p>
        </div>
    )
}