import signSVG from '../assets/signature.svg';
import styles from './layout.module.css';

export default function Footer() {
    return(
        <>
            <div className={styles.footer}>
                <a href="https://github.com/gabebnz" target="_blank">
                    <img src={signSVG} alt='made by gabriel'/>
                </a>
            </div>
        </>
    )
} 