import React, { useContext, useEffect } from 'react';
import { SettingsContext } from '../providers/SettingsProvider';

import styles from './layout.module.css';

import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
	children?: React.ReactNode;
}

export default function Test({ children }: Props) {
	const settings = useContext(SettingsContext);

	const updateSettings = () => {
		settings.updateSettings(curSettings => {
			const newSettings = { ...curSettings };

			// TODO: change to take data from checkboxes/settings modal
			// also needs to set username setting 

			newSettings.darkTheme = !newSettings.darkTheme;
			return newSettings;
		});
	}

	return (
		<div className={styles.wrapper}>
			<Navbar />
				<div className={styles.childWrapper}>
					{children}

					<h2>darkTheme: {settings.darkTheme.toString()}</h2>
					<h2>username: {settings.username === '' ? "not set" : settings.username.toString()}</h2>
					<p>settings loaded: {settings.loaded.toString()}</p>

					<button onClick={() => updateSettings()}>Toggle Dark Theme</button>
				</div>
			<Footer />
		</div>
	)
}