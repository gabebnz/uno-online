import { useEffect, useState } from 'react';

import Styles from './Loader.module.css';


type Props = {
	children?: React.ReactNode;
}

export default function Loader() {
    const [loadingText, setText] = useState('Loading...');

    useEffect(() => {
        const textDelay = setTimeout(() => {
            setText('Server waking up...')
        }, 5000);

        const textDelay2 = setTimeout(() => {
            setText('Something may be wrong...')
        }, 20000);
        return () => {
            clearTimeout(textDelay);
            clearTimeout(textDelay2);
        }
    }, [])

	return (
		<div className={Styles.Wrapper}>
            <div className={Styles.UnoButton}>
                <div className={Styles.UnoButtonCircle}/>
            </div>

            <h1>{loadingText}</h1>
		</div>
	)
}