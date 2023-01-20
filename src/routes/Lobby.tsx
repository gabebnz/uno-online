import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Styles from './Lobby.module.css';


import GameBoard from '../components/game/GameBoard';

type Props = {
	title?: string,
}

const socket = io('http://localhost:4000');

export default function Lobby({ title } : Props ) {
    const { gameID } = useParams<{ gameID: string }>();
    const [users, setUsers] = useState(0);

    useEffect(() => {
        socket.emit('join', gameID);

        socket.on('message', (msg) => {
            console.log(msg);
        });

        socket.on('data', (data) => {
            setUsers(data)
        })


		return () => {
            socket.emit('leave', gameID);
            socket.off('connect');
			socket.off('disconnect');
		}
	}, []);

    // doc title
	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
        <div className={Styles.Lobby}>
        	<h1>Lobby</h1>
            <p>Users in room: {users}</p>
            <p>Game code: {gameID}</p>
            <p>My id: {socket.id}</p>
        </div>
	)
}