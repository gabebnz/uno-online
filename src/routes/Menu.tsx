import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const menuLoader = () => {
    
};

type Props = {
    title?: string;
}

export default function Menu({ title } : Props ) {

    useEffect(() => {
        if (title) {
          document.title = title;
        } 
      }, []);

    return(
        <>
            <h1>Menu</h1>
            <Link to="/create">Create</Link>
        </>
    )
}