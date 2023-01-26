import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SocketContext } from '../providers/GameProvider';
import { SettingsContext } from '../providers/SettingsProvider';
import styles from './MenuCard.module.css';


interface Props {
    title: string,
    icon?: React.ReactNode,
    link: string,
}

export default function MenuCard({title, icon, link}:Props){
    const settings = useContext(SettingsContext);
    const redirect = useNavigate();
    const socket = useContext(SocketContext);


    // May need to do check if lobby already exists.
	const generateLobbyCode = () => {
		const length = 6;
		var result = 'uno-';
	  	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  	var charactersLength = characters.length;
	  	for ( var i = 0; i < length; i++ ) {
		  	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	  	}
	
	  	return result;
	}

    const navCode = () => {
        if(link === ""){
            const code = generateLobbyCode();

            socket.emit('create-game', code, settings.username);
            redirect(`/game/${code}`)
            return
        }

        redirect(link)
    }

    return(
        <a className={styles[title]} onClick={() => navCode()}>
            <div className={styles.CardHeader}>
                {icon}
                <p className={styles.regularFont}>{title}</p>
            </div>
        </a>
    )
}