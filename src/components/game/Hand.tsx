import React, { useContext } from 'react';
import { GameContext, GameDispatchContext } from '../../providers/GameProvider';
import { SettingsContext } from '../../providers/SettingsProvider';


import GameCard from './Card';
import Styles from './Hand.module.css';

interface Props{
    children?: React.ReactNode;
    player: number;
    show: boolean;
}

export default function Hand({player, show}:Props) {
    const settings = useContext(SettingsContext);
    const uno = useContext(GameContext);
    const hand = uno.players[player].hand;


    if(player === 0){ // Player
        return(
            <div className={`${Styles.PlayerSection} ${uno.players[player].isUno === true && Styles.UnoGlow}`}>
                
                <div className={Styles.HandHeader}>
                    <h1 className={`${player === uno.currentPlayer && Styles.ActivePlayer}`}>
                        {settings.username} 
                    </h1>

                    <p>{hand.length}</p>
                </div>
                




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
            <div className={`${Styles.BotSection} ${uno.players[player].isUno === true && Styles.UnoGlow}`}>
                <div className={Styles.HandHeader}>
                    <h1 className={`${player === uno.currentPlayer && Styles.ActivePlayer}`}>
                        {uno.players[player].name}
                    </h1>

                    <p>{hand.length}</p>
                </div>

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