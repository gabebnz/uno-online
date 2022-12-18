import React, { useContext } from 'react';
import { SettingsContext } from '../providers/SettingsProvider';
import Modal from './modal/Modal';

import { CiSettings } from 'react-icons/ci';
import styles from './layout.module.css';
 
export default function Navbar() {
    const settings = useContext(SettingsContext);
    const [settingsOpen, setSettingsOpen] = React.useState(false);



	const updateSettings = () => {
		settings.updateSettings(curSettings => {
			const newSettings = { ...curSettings };

			// TODO: change to take data from checkboxes/settings modal
			// also needs to set username setting 

			newSettings.darkTheme = !newSettings.darkTheme;
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
            
            <Modal open={settingsOpen} setOpen={setSettingsOpen} title="Settings">
                    <h2>darkTheme: {settings.darkTheme.toString()}</h2>
					<h2>username: {settings.username === '' ? "not set" : settings.username.toString()}</h2>
					<p>settings loaded: {settings.loaded.toString()}</p>

					<button onClick={() => updateSettings()}>Toggle Dark Theme</button>
                
            </Modal>
        </>
    )
}