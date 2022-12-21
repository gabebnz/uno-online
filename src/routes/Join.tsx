import React, { useEffect } from 'react';
import Layout from '../components/Layout';

type Props = {
	title?: string;
}

export default function Join({ title } : Props ) {

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<h1>Join</h1>
	)
}