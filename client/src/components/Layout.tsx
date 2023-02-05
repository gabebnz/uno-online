import styles from './layout.module.css';

import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
	children?: React.ReactNode;
}

export default function Layout({ children }: Props) {


	return (
		<div className={styles.wrapper}>
			<Navbar />
				{/* Holds main application */}
				<div className={styles.childWrapper}>
					{children}
					<Outlet />
				</div>
			<Footer />
		</div>
	)
}