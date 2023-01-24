import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsPlay, BsQuestion } from 'react-icons/bs';
import MenuCard from '../components/MenuCard';
import { SettingsContext } from '../providers/SettingsProvider';
import { SocketContext } from '../providers/SocketProvider';
import styles from './Menu.module.css';

import { useNavigate } from 'react-router-dom';


type Props = {
	title?: string;
}

export default function Menu({ title } : Props ) {
	const settings = useContext(SettingsContext);
	const socket = useContext(SocketContext)
	const redirect = useNavigate();
	const [lobbyCode, setLobbyCode] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	const handleLobbySubmit = (event : React.FormEvent<HTMLFormElement>) =>{
		event.preventDefault();
		setErrorMsg('');

		socket.emit('join', lobbyCode, settings.username);

		socket.on('error', (msg) => {
			console.log(msg);
			setErrorMsg(msg);
		})
		
		if(!errorMsg){
			redirect(`/game/${lobbyCode}`)
		}
	}
 
	return(
		<div className={styles.OuterWrapper}>
			<div className={styles.MenuWrapper}>  
				<MenuCard title="play" link="/game" icon={<BsPlay className='icon'/>}/>
				<MenuCard title="create" link="" icon={<AiOutlineUsergroupAdd className='icon'/>}/>
				<MenuCard title="help" link="/help" icon={<BsQuestion className='icon'/>}/>
			</div>

			<form className={styles.LobbyCodeForm} onSubmit={handleLobbySubmit}>
				<input 
					type="text" 
					value={lobbyCode} 
					placeholder="lobby code" 
					onChange={(e) => setLobbyCode(e.target.value)}
					/>
				
			</form>
			<p>{errorMsg}</p>

		</div>
	)
}