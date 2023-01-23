import React from 'react';
import Styles from './LobbyCard.module.css';

type Props = {
	name?: string;
    card: number;
}

export default function LobbyCard({ name, card }: Props) {

    let innerCard = 
    <>
        <div className={Styles.TopLeft}>
            <h1>{card}</h1>
        </div>
        <div className={Styles.Middle}>
            <h1>{name}</h1>
        </div>
        <div className={Styles.BotRight}>
            <h1>{card}</h1>

        </div>
    </>

    if(!name){
        innerCard = 
        <>
            <div className={Styles.Middle}>
                <h1>UNO</h1>
            </div>
        </>
    }


	return (
        <div 
        className={`
            ${Styles.CardWrapper} 
            ${card} 
            ${!name && "MissingPlayer"}
        `}
        >
            {innerCard}
        </div>
	)
}