import { useContext, useState } from 'react';
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import ErrorBoundary from './routes/ErrorBoundary';

import Layout from './components/Layout';

import { SettingsContext, SettingsProvider } from './providers/SettingsProvider';
import Create from './routes/Create';
import Game from './routes/Game';
import Join from './routes/Join';
import Menu from './routes/Menu';



function App() {
	const settings = useContext(SettingsContext);

	const router = createBrowserRouter([
		{
			element: <Layout />,
			errorElement: <ErrorBoundary />,
			children: [
				{
					path: '/',
					element: <Menu title="Main Menu | UNO!" />,
				},
				{
					path: '/game',
					element: <Game title="UNO!" />,
				},
				{
					path: '/game/:gameID',
					element: <Game title="UNO!" />,
				},
				{
					path: '/create',
					element: <Create title="Create Game | UNO!" />,
				},
				{
					path: '/join',
					element: <Join title="Multiplayer | UNO!" />,
				},
			]
		}
	]);

	return (
		<SettingsProvider>
			<RouterProvider router={router} />
		</SettingsProvider>
	)
}

export default App
