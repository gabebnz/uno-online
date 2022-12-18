import { useContext, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from './components/Layout';

import { SettingsContext, SettingsProvider } from './providers/SettingsProvider';
import Create from './routes/Create';
import Menu, { menuLoader } from './routes/Menu';



function App() {
	const settings = useContext(SettingsContext);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Menu title="Main Menu | UNO!" />
		},
		{
			path: '/create',
			element: <Create title="New Game | UNO!" />
		}

	])

	return (
		<SettingsProvider>
			<Layout>
				<RouterProvider router={router} />
			</Layout>
		</SettingsProvider>
	)
}

export default App
