import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';

import GlobalAuth from './HocGlobalAuth';

import { StatusConsumer } from '../services/status.context';
import { IGlobalAuth } from '../types/global.types';

import config from '../config';

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

			<ul>
				<li>
					<Link href={`/home`}>
						<a>Home</a>
					</Link>
				</li>
				{globalAuth.isLoggedIn && globalAuth.user ? (
					<li>
						<Link href={`/authed-fb?success=true`}>
							<a>My account</a>
						</Link>
					</li>
				) : (
					<li>
						<Link href={`${config.apiUrl}/auth/facebook`}>
							<a>Register/Login</a>
						</Link>
					</li>
				)}
				<li>
					<Link href={`/about`}>
						<a>About</a>
					</Link>
				</li>
			</ul>
			<div>
				<Link href={`/admin-login`}>
					<a>Adminland</a>
				</Link>
			</div>
		</div>
	);
}

export default GlobalAuth(Header);
