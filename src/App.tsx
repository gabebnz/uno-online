import { useContext, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorBoundary from './routes/ErrorBoundary';

import Layout from './components/Layout';

import { SettingsContext, SettingsProvider } from './providers/SettingsProvider';
import Create from './routes/Create';
import Menu, { menuLoader } from './routes/Menu';



function App() {
	const settings = useContext(SettingsContext);

	const router = createBrowserRouter([
		{
			path: '/',
			element: <Menu title="Main Menu | UNO!" />,
			errorElement: <ErrorBoundary />,
		},
		{
			path: '/play',
			//element: <Game title="UNO!" />,
			errorElement: <ErrorBoundary />,
		},
		{
			path: '/create',
			element: <Create title="New Game | UNO!" />,
			errorElement: <ErrorBoundary />,
		},
		{
			path: '/join',
			//element: <Join title="Multiplayer | UNO!" />,
			errorElement: <ErrorBoundary />,
		},
	]);

	return (
		<SettingsProvider>
			<Layout>
				<RouterProvider router={router} />
			</Layout>
		</SettingsProvider>
	)
}

export default App
