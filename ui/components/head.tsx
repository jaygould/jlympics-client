import Head from 'next/head';
import * as React from 'react';

import GlobalAuth from './HocGlobalAuth';

import { StatusConsumer } from '../services/status.context';
import { IGlobalAuth } from '../types/global.types';

interface IProps {
	globalAuth: IGlobalAuth;
}

function Header(props: IProps) {
	const { globalAuth } = props;
	return (
		<div>
			<StatusConsumer>
				{globalStatus => {
					return globalStatus ? (
						<p className="globalStatus">{globalStatus.message}</p>
					) : null;
				}}
			</StatusConsumer>

			{globalAuth.isLoggedIn && globalAuth.user ? (
				<div>
					<p>
						Logged in with user:{' '}
						{globalAuth.user.email || globalAuth.user.displayName}
					</p>
					<button
						onClick={() => {
							globalAuth.logout();
						}}
					>
						Log out
					</button>
				</div>
			) : null}

			<Head>
				<title>My page title</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<p>Header</p>
		</div>
	);
}

export default GlobalAuth(Header);
