import '../globals/global.scss';
const css = require('./Head.scss');

import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';

import { StatusConsumer } from '../services/status.context';
import { IGlobalAuth } from '../types/global.types';
import GlobalAuth from './HocGlobalAuth';
import UserProfile from './UserProfile';

import config from '../config';

interface IProps {
	globalAuth: IGlobalAuth;
}

function Header(props: IProps) {
	const { globalAuth } = props;
	const [active, toggleMenu] = React.useState(false);

	return (
		<React.Fragment>
			<StatusConsumer>
				{globalStatus => {
					return globalStatus && globalStatus.message ? (
						<div className={css.globalStatusWrap}>
							<p className="globalStatus">{globalStatus.message}</p>
						</div>
					) : null;
				}}
			</StatusConsumer>

			<Head>
				<title>
					{config.siteName} | {config.siteTag}
				</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div className={css.header}>
				<Link href={`/`}>
					<h1>{config.siteName}</h1>
				</Link>

				<UserProfile globalAuth={globalAuth} />

				<nav role={css.navigation}>
					<div
						className={`${css.close} ${active ? css.showClose : null}`}
						onClick={() => toggleMenu(!active)}
					>
						<div className={`${css.menuBtn} ${css.cancelIcon}`}>
							<img className={css.menuIcon} src="/static/icons/close.svg" />
						</div>
					</div>
					<div className={`${css.menu} ${active ? css.open : null}`}>
						<ul className={css.menuBlock}>
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
							<li>
								<Link href={`/admin-login`}>
									<a>Adminland</a>
								</Link>
							</li>
							{globalAuth.isLoggedIn ? (
								<li
									onClick={() => {
										globalAuth.logout();
									}}
								>
									<a>Logout</a>
								</li>
							) : null}
						</ul>
					</div>
					<div className={`${css.toggle} `} onClick={() => toggleMenu(!active)}>
						<div className={`${css.menuBtn}`}>
							<img className={css.menuIcon} src="/static/icons/menu.svg" />
						</div>
					</div>
				</nav>
			</div>
		</React.Fragment>
	);
}

export default GlobalAuth(Header);
