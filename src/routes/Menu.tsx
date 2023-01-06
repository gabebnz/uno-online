import React, { useEffect } from 'react';
import { AiOutlineUser, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { CiGlobe } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import MenuCard from '../components/MenuCard';
import styles from './Menu.module.css';


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

            <div className={styles.MenuWrapper}>  
                <MenuCard title="play" link="/uno-online/game" icon={<AiOutlineUser className='icon'/>}/>
                <MenuCard title="create" link="/uno-online/create" icon={<AiOutlineUsergroupAdd className='icon'/>}/>
                <MenuCard title="join" link="/uno-online/join" icon={<CiGlobe className='icon'/>}/>
            </div>


    )
}