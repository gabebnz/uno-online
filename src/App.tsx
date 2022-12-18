import { useContext, useState } from 'react';
import './App.css';

import Test from './Test';

import { SettingsContext, SettingsProvider } from './providers/SettingsProvider';


function App() {
  const settings = useContext(SettingsContext);




  return (
    <SettingsProvider>
      <Test />
    </SettingsProvider>
  )
}

export default App
