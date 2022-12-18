import React, { useContext, useRef, useState } from 'react';
import { SettingsContext } from '../providers/SettingsProvider';
import Modal from './modal/Modal';

import { CiSettings } from 'react-icons/ci';
import styles from './layout.module.css';
 
export default function Navbar() {
    const settings = useContext(SettingsContext);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const darkThemeCheckbox = useRef<HTMLInputElement>(null);
    const usernameInputBox = useRef<HTMLInputElement>(null)

	const updateSettings = () => {
		settings.updateSettings(curSettings => {
			const newSettings = { ...curSettings };

            // if darkthemecheckbox != null, set settings.darktheme to value
			darkThemeCheckbox.current && (newSettings.darkTheme = darkThemeCheckbox.current.checked)
            usernameInputBox.current  && (newSettings.username = usernameInputBox.current.value)

			return newSettings;
		});
	}


 
    return(
        <>
            <div className={styles.navbar}>
                {/* first ciSettings HIDDEN for justify-content symmetry */}
                <CiSettings className={styles.navLeftInvis}/> 
                <h1>uno online</h1>
                <CiSettings onClick={() => setSettingsOpen(true)} className={styles.navSettings}/>
            </div>
            
            <Modal open={settingsOpen} setOpen={setSettingsOpen} title="user settings">
                    <div className={styles.darkThemeInput}>
                        <p className="titleFont">dark theme:</p>
                        <input
                            type='checkbox'
                            ref={darkThemeCheckbox}
                            checked={settings.darkTheme}
                            onChange={() => updateSettings()}
                        />
                    </div>

                    <div className={styles.usernameInput}>
                        <p className="titleFont">username:</p>
                        <input 
                            type='text' 
                            ref={usernameInputBox} 
                            value={settings.username}
                            onChange={() => updateSettings()}
                        />
                    </div>
            </Modal>
        </>
    )
}