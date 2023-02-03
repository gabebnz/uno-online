import { useContext } from 'react';
import { AiFillTrophy } from 'react-icons/ai';
import { UnoContext } from '../../components/game/GameBoard';
import { SocketContext } from '../../providers/SocketProvider';
import Styles from './EndScreen.module.css';


export default function EndScreen() {
    const socket = useContext(SocketContext);
    const uno = useContext(UnoContext);

    const handleNewGame = () => {
        socket.emit('new-game', uno.roomID);
    }

    return (
        <div className={Styles.EndScreen}>
            <div className={Styles.CircleWrapper}>
                <div className={Styles.Circle} />

                <div className={Styles.CardWrapper}>
                    <div className={`${Styles.Card} ${'LeftCard'}`}>
                        <AiFillTrophy className={Styles.Icon} />
                    </div>
                </div>

                <div className={Styles.CardWrapper}>
                    <div className={`${Styles.Card} ${'RightCard'}`}>
                        <h1>{uno.winner?.name}</h1>
                    </div> 
                </div>
            </div>

            <button 
                onClick={() => handleNewGame()} 
                >new game
            </button>
        </div>
    )
}