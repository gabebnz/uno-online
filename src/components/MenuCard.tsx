import React from 'react';
import { type IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import styles from './MenuCard.module.css';


interface Props {
    title: string,
    icon?: React.ReactNode,
    link: string,
}

export default function MenuCard({title, icon, link}:Props){

    return(
        <Link className={styles.Card}to={link}>
            <div className={styles.CardHeader}>
                {icon}
                <p>{title}</p>
            </div>
        </Link>
    )
}