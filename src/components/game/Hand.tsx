import React, { useContext } from 'react';
import { GameContext } from '../../providers/GameProvider';
import GameCard from './Card';
import Styles from './Hand.module.css';

interface Props{
    children?: React.ReactNode;
    player: number;
    show: boolean;
}


export default function Hand({player, show}:Props) {
    const game = useContext(GameContext);
    const hand = game.players[player].hand;

    //Also print player details: name, card count

    return(
        <div className={Styles.Hand}>
            {
                hand.map((card, index) => {
                    return <GameCard key={index} show={show} card={card}>{card.value}</GameCard>
                })
            }
        </div>
    )
}