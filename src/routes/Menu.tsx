import React, { useEffect } from 'react';
import { AiOutlineUser, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { CiGlobe } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import MenuCard from '../components/MenuCard';


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
            <MenuCard title="play" link="/play" icon={<AiOutlineUser className='icon'/>}/>
            
        </>
    )
}