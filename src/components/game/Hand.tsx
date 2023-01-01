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

    if(player === 0){ // Player
        return(
            <div className={Styles.PlayerSection}>
                <h1>{game.players[player].name} {hand.length}</h1>
                <div className={`${Styles.Hand} ${Styles.PlayerHand}`}>
                    {
                        hand.map((card, index) => {
                            return <GameCard key={index} show={show} card={card}>{card.value}</GameCard>
                        })
                    }
                </div>
            </div>
    
        )
    }
    else{
        return(
            <div className={Styles.BotSection}>
                <h1>{game.players[player].name} {hand.length}</h1>
                <div className={`${Styles.Hand}`}>
                    {
                        hand.map((card, index) => {
                            return <GameCard key={index} show={show} card={card}>{card.value}</GameCard>
                        })
                    }
                </div>
            </div>
    
        )
    }
}