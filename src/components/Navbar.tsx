import React from 'react';


import { CiSettings } from 'react-icons/ci';
import styles from './layout.module.css';

export default function Navbar() {

    return(
        <>
            <div className={styles.navbar}>
                {/* first ciSettings HIDDEN for justify-content symmetry */}
                <CiSettings className={styles.navLeftInvis}/> 
                <h1>uno online</h1>
                <CiSettings onClick={() => undefined} className={styles.navSettings}/>
            </div>
        </>
    )
}