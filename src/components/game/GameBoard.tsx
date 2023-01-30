import React, { useContext, useEffect, useState } from 'react';
import { checkPlayableCards, type GameState } from '../../game/uno';
import { SocketContext } from '../../providers/SocketProvider';

import Styles from './GameBoard.module.css';

import GameCard from './Card';
import EndScreen from './EndScreen';
import Hand from './Hand';

interface Props {
    children?: React.ReactNode;
    uno: GameState;
    roomID?: string;
}

export const UnoContext = React.createContext<GameState & {roomID: string | undefined, playerIndex: number}>(null!);

export default function GameBoard({ uno, roomID }: Props) {
    const [glowColor, setGlowColor] = useState('');
    const socket = useContext(SocketContext);
    
    let localPlayerIndex = uno.players?.findIndex(player => player.socketID === socket.id) ;
    if (localPlayerIndex === -1){
        localPlayerIndex = 0;
    }

    // Turn logic
    useEffect(() => { 
        if(uno.playing){
            
            if (uno.currentPlayer !== null){
                // if player/bot has 2 cards left and one can be played, set unoCallPossible to true
                if(uno.players[uno.currentPlayer].hand.length <= 2 && checkPlayableCards(uno)){
                    socket.emit('set-uno-call-possible', roomID, uno.currentPlayer);
                }
    
                // if(uno.players[uno.currentPlayer!].type === 'bot' && uno.players[uno.currentPlayer!].socketID !== socket.id){
                //     console.log('BOT TURN APPARENTLY');
                    
                //     const cardDelay = setTimeout(() => {
                //         socket.emit('bot-turn', roomID)
                //     }, Math.floor(Math.random() * 500)+1000);
            
                //     const finishDelay = setTimeout(() => {
                //         socket.emit('finish-turn', roomID)
                //     }, 2500);
                  
    
                //     return () => {
                //         clearTimeout(cardDelay);
                //         clearTimeout(finishDelay);
                //     };
                // }
                else if(uno.currentPlayer === localPlayerIndex){
                    if(!checkPlayableCards(uno)){ 
                        const pickupDelay = setTimeout(() => {
                            socket.emit('pickup-card', roomID, uno.currentPlayer, 1);
                        }, 1000);
    
                        const finishDelay = setTimeout(() => {
                            socket.emit('finish-turn', roomID)
                        }, 3000);
    
                        return () => {
                            clearTimeout(pickupDelay);
                            clearTimeout(finishDelay);
                        };
                    }
                }
                else{
                    console.error('invalid player type');
                }
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


    function handleUnoCall(){
        socket.emit('call-uno', roomID, localPlayerIndex)
    }

    if(!uno){
        return <div>DATA ERROR...</div>
    }


    return (
        <UnoContext.Provider value={{...uno, roomID: roomID, playerIndex: localPlayerIndex}}>
            {
                uno.winner && (
                    <EndScreen />
                )
            }

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

                { // UNO CALL BUTTON
                    (
                        uno.players[localPlayerIndex].isUnoCallPossible 
                        && !uno.players[localPlayerIndex].isUno // user hasnt already called uno
                        
                    ) 
                    && (
                        <div className={Styles.UnoButtonWrapper}>
                            <div className={Styles.UnoButton} onClick={() => handleUnoCall()}>
                                <div className={Styles.UnoButtonCircle}/>
                                <h1 className={Styles.SelectButton}>UNO</h1>
                            </div>
                        </div>
                    ) 
                }

                <div className={`${Styles.HandWrapper} ${uno.currentPlayer === localPlayerIndex && Styles.ActivePlayer}`}>
                    <Hand show={true} player={localPlayerIndex}/>
                </div>

                <div className={`${Styles.LeftHandWrapper} ${(localPlayerIndex! + 1) % 4 && Styles.ActivePlayer}`}>
                    <Hand show={false} player={(localPlayerIndex! + 1) % 4}/>
                </div>

                <div className={`${Styles.TopHandWrapper} ${(localPlayerIndex! + 2) % 4 && Styles.ActivePlayer}`}>
                    <Hand show={false} player={(localPlayerIndex! + 2) % 4}/>
                </div>

                <div className={`${Styles.RightHandWrapper} ${(localPlayerIndex! + 3) % 4 && Styles.ActivePlayer}`}>
                    <Hand show={false} player={(localPlayerIndex! + 3) % 4}/>
                </div>


            </div>
        </UnoContext.Provider>

    )
    
}