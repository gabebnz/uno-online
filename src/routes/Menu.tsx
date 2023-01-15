import React, { useEffect } from 'react';
import { AiOutlinePlayCircle, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsPlay } from 'react-icons/bs';
import { CiGlobe } from 'react-icons/ci';
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
                <MenuCard title="play" link="/game" icon={<BsPlay className='icon'/>}/>
                <MenuCard title="create" link="/create" icon={<AiOutlineUsergroupAdd className='icon'/>}/>
                <MenuCard title="join" link="/join" icon={<CiGlobe className='icon'/>}/>
            </div>


    )
}