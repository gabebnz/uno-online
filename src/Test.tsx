import React, { useContext } from 'react';
import { SettingsContext } from './providers/SettingsProvider';

export default function Test() {
    const settings = useContext(SettingsContext);

    const updateSettings = () => {
        settings.updateSettings(curSettings => {
          const newSettings = {...curSettings};
          newSettings.darkTheme = !newSettings.darkTheme;
          return newSettings;
        });
      }

    return (
        <>
            <h1>darkTheme: {settings.darkTheme.toString()}</h1>
            <h1>username: {settings.username === '' ? "not set": settings.username.toString()}</h1>
            <p>settings loaded: {settings.loaded.toString()}</p>

            <button onClick={() => updateSettings()}>Toggle Dark Theme</button>
        </>
    )
}