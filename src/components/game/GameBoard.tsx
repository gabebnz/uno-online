import React, { useContext, useEffect, useState } from 'react';
import { checkPlayableCards, type GameState } from '../../game/uno';
import { SocketContext } from '../../providers/SocketProvider';

import Styles from './GameBoard.module.css';

import AlertButton from './AlertButton';
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
                if(uno.currentPlayer === localPlayerIndex){

                    if( // if player/bot has 2 cards left and one can be played, set unoCallPossible to true
                        uno.players[uno.currentPlayer].hand.length <= 2 && 
                        !uno.players[uno.currentPlayer].isSkipped &&
                        checkPlayableCards(uno) &&
                        !uno.players[uno.currentPlayer].isUnoCallPossible
                        ){
                        console.log('set uno call possible');
                        
                        socket.emit('set-uno-call-possible', roomID, uno.currentPlayer);
                    } 



                    if(!checkPlayableCards(uno) && !uno.players[uno.currentPlayer].isSkipped){                         
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

    if(!uno || uno === undefined){
        return <div>DATA ERROR...</div>
    }


    return (
        <UnoContext.Provider value={{...uno, roomID: roomID, playerIndex: localPlayerIndex}}>

            {   // END SCREEN
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
                        uno.playing &&
                        uno.players[localPlayerIndex].isUnoCallPossible &&
                        !uno.players[localPlayerIndex].isSkipped && 
                        !uno.players[localPlayerIndex].isUno // user hasnt already called uno
                    ) 
                    && (
                        <AlertButton text="UNO" action={() => handleUnoCall()} alert={true}/>
                    ) 
                }

                { // UNO CHALLENGE BUTTON
                    (
                        uno.shouldCallUno &&
                        uno.shouldCallUno !== socket.id &&
                        uno.playing
                    ) 
                    && (
                        <AlertButton text="!" action={() => socket.emit('challenge-uno', roomID)} alert={true}/>
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