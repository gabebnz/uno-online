import React, { useContext, useEffect } from 'react';
import { UnoContext } from '../../components/game/GameBoard';
import { SettingsContext } from '../../providers/SettingsProvider';
import { SocketContext } from '../../providers/SocketProvider';


import GameCard from './Card';
import Styles from './Hand.module.css';

interface Props{
    children?: React.ReactNode;
    player: number;
    show: boolean;
}

export default function Hand({player, show}:Props) {
    const settings = useContext(SettingsContext);
    const socket = useContext(SocketContext);
    const uno = useContext(UnoContext);

    const hand = uno.players[player].hand;

    function handleColorSelect(color:string){
		console.log('color selected: ' + color);
        socket.emit('set-color', uno.roomID, color)
		socket.emit('finish-turn', uno.roomID )
	}

    if(player === uno.playerIndex){ // Player
        return(
            <div className={`${Styles.PlayerSection}`}>
                
                <div className={Styles.HandHeader}>
                    <h1 className={`${player === uno.currentPlayer && Styles.ActivePlayer} `}>
                        {settings.username} 
                    </h1>

                    <p>{hand.length}</p>
                </div>


                {
                    (uno.askForColor && uno.currentPlayer === uno.playerIndex) && (
                        <div className={`${Styles.ColorSelect} ${(uno.askForColor && uno.currentPlayer === 0) ? 'true' : 'false'}`}>
                            <button className={`${Styles.SelectCard} ${'red'}`} onClick={() => handleColorSelect('red')}></button>
                            <button className={`${Styles.SelectCard} ${'blue'}`} onClick={() => handleColorSelect('blue')}></button>
                            <button className={`${Styles.SelectCard} ${'green'}`} onClick={() => handleColorSelect('green')}></button>
                            <button className={`${Styles.SelectCard} ${'yellow'}`} onClick={() => handleColorSelect('yellow')}></button>
                        </div>
                    )
			    }
                

                <div className={`
                    ${Styles.Hand} 
                    ${Styles.PlayerHand} 
                    ${uno.players[player].isUno === true && Styles.UnoGlow}
                    ${uno.players[player].isSkipped === true && 'skipped'}
                `}>
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
        return( // Bot / other Player
            <div className={`${Styles.BotSection}`}>
                <div className={Styles.HandHeader}>
                    <h1 className={`${player === uno.currentPlayer && Styles.ActivePlayer}`}>
                        {uno.players[player].name}
                    </h1>

                    <p>{hand.length}</p>
                </div>

                <div className={`
                    ${Styles.Hand} 
                    ${uno.players[player].isUno === true && Styles.UnoGlow}
                    ${uno.players[player].isSkipped === true && 'skipped'}
                `}>
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