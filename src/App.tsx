import { createHashRouter, RouterProvider } from "react-router-dom";

import { GameProvider } from './providers/GameProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { RoomProvider } from './providers/SocketProvider';

import Layout from './components/Layout';
import ErrorBoundary from './routes/ErrorBoundary';
import Game from './routes/Game';
import Help from './routes/Help';
import Lobby from './routes/Lobby';
import Menu from './routes/Menu';

function App() {
	const router = createHashRouter([ // Use createBrowserRouter when not using github pages
		{
			element: <Layout />,
			errorElement: <ErrorBoundary />,
			children: [
				{
					path: '/',
					element: <Menu title="UNO!" />,
				},
				{
					path: '/game',
					element: <Game title="UNO!" />,
				},
				{
					path: '/game/:gameID',
					element: <Lobby title="Multiplayer | UNO!" />,
				},
				{
					path: '/help',
					element: <Help title="Help | UNO!" />,
				},
			]
		}
	]);

	return (
		<SettingsProvider>
			<RoomProvider>
				<GameProvider>
					<RouterProvider router={router} />
				</GameProvider>
			</RoomProvider>
		</SettingsProvider>
	)
}

export default App
