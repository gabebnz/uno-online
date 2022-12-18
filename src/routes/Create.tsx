import React, { useEffect } from 'react';

type Props = {
	title?: string;
}

export default function Create({ title } : Props ) {

	useEffect(() => {
		if (title) {
		  document.title = title;
		} 
	  }, []);

	return(
		<>
			<h1>Create</h1>
		</>
	)
}