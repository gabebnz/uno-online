import React, { useEffect } from 'react';
import styles from './modal.module.css';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    children?: React.ReactNode;
}

export default function Modal({open, setOpen, title, children}: Props) {

    return(
        <>
        {
            open && (
                <div className={styles.modal}>
                    <div className={styles.modalOuterContainer} > 
                        <div className={styles.modalContainer} >
                            <div className={styles.modalHeader} >
                                <h2 className="titleFont">{title}</h2>
                            </div>
                            <div className={styles.modalBody}>
                                {children}
                            </div>
                            <div className={styles.modalFooter}>
                                <button onClick={() => setOpen(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}