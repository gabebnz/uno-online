import React, { createContext, useEffect, useState } from 'react';

/*
Heavy provider insperation from this project:
https://github.com/zaccnz/sudoku/blob/main/src/providers/SettingsProvider.tsx
Thanks zac :)
*/

export interface Settings {
    /* preferences */
    darkTheme: boolean;
    username: string;

    /* state */
    loaded: boolean;
}

const InitialSettings: Settings = {
    darkTheme: false,
    username: '',

    loaded: false,
};


const loadSettingBool = (settings: Settings, key: keyof Settings) => {
    const value = localStorage.getItem(`uno.${key}`);
    value && ((settings[key] as boolean) = value === 'true');
}

const loadSettingString = (settings: Settings, key: keyof Settings) => {
    const value = localStorage.getItem(`uno.${key}`);
    value && ((settings[key] as string) = value);
}
 
// load existing settings from local storage
const findExistingSettings = (): Settings => {
    const settings = { ...InitialSettings };

    loadSettingBool(settings, 'darkTheme');
    loadSettingString(settings, 'username');
    settings.loaded = true;

    return settings;
}

const saveSettings = (settings: Settings) => {
    if(!settings.loaded){
        return;
    }
    
    localStorage.setItem(`uno.darkTheme`, `${settings.darkTheme}`);
    localStorage.setItem(`uno.username`, `${settings.username}`);
    return;
}

type UpdateSettings = React.Dispatch<React.SetStateAction<Settings>>

export const SettingsContext = createContext<Settings & {updateSettings: UpdateSettings}>({...InitialSettings, updateSettings: () => undefined});

interface SettingsProviderProps {
    children?: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = (props) => {
    const [settings, setSettings] = useState<Settings>(InitialSettings);
    
    // run once on load to load existing settings
    useEffect(() => {
        setSettings(findExistingSettings)
    }, []);

    // toggle dark theme attribute on settings state change
    useEffect(() => {
        if(settings.darkTheme){
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        else{   
            document.documentElement.removeAttribute('data-theme');
        }
    }, [settings.darkTheme]);

    // save settings to local storage on settings state change
    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    return (
        <SettingsContext.Provider value={{...settings, updateSettings: setSettings}}>
            {props.children}
        </SettingsContext.Provider>
    );
}