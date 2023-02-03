import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type Props = {
	title?: string,
}

export default function Game({ title } : Props ) {
	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<h1>Help / About</h1>
	)
}

