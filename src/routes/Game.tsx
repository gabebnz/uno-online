import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

type Props = {
	title?: string,
}

export default function Game({ title} : Props ) {
    const { gameID } = useParams<{ gameID: string }>();

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
        <>
            <h1>game</h1>
            <p>id: {gameID}</p>
        </>
	)
}