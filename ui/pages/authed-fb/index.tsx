const css = require('./index.scss');

import Link from 'next/link';
import * as React from 'react';

import Header from '../../components/head';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';
import authService from '../../services/auth.service';
import fitbitService from '../../services/fitbit.service';
import { IGlobalAuth } from '../../types/global.types';

import config from '../../config';

interface IProps {
	globalAuth: IGlobalAuth;
	pageProps: any;
}
class AuthedFb extends React.Component<IProps, { isActive: boolean }> {
	static async getInitialProps(ctx: any) {
		const fbJwt: any = authService.fbJwtMiddleware(ctx);
		if (fbJwt) {
			// user is either coming from fb callback with token in url, or has token in their cookie
			const resp = await authService.checkAuthToken(fbJwt).then(async auth => {
				if (auth.success) {
					const thisUser = authService.parseJwt(fbJwt, true);
					const fitbitData = await fitbitService.getUserFitbitData(thisUser.fbId);
					return { query: ctx.query, thisUser, fitbitData };
				} else {
					authService.removeCookie(ctx, 'fbJwt');
					authService.redirectUser('/home', { ctx, status: 301 });
				}
			});
			return resp ? { pageProps: resp } : {};
		} else {
			authService.redirectUser('/home', { ctx, status: 301 });
		}
	}
	constructor(props: any) {
		super(props);
		this.state = {
			isActive: false
		};
	}
	componentDidMount() {
		const { globalAuth, pageProps } = this.props;
		this.setState({
			isActive: this.props.pageProps.fitbitData.isActive
		});
		setTimeout(() => {
			// settimeout is needed to run the addUserDetails function after the authContext
			// is rendered in the HoC.
			globalAuth.addUserDetails({
				displayName: pageProps.thisUser.displayName
			});
		}, 0);
	}
	updateActiveStatus(fitbitId: any, activeStatus: any) {
		fitbitService.updateFitbitStatus(fitbitId, activeStatus).then(() => {
			this.setState({ isActive: activeStatus });
		});
	}
	render() {
		const { pageProps } = this.props;
		const { isActive } = this.state;
		return (
			<div>
				<Header />
				<h2 className={css.example}>
					You have logged in successfully as{' '}
					{pageProps.thisUser.displayName
						? pageProps.thisUser.displayName
						: 'a Facebook user'}
					!
				</h2>
				{pageProps.thisUser.fitbit ? (
					<div>
						<div>
							<p>You are connected to your Fitbit account:</p>
							<img src={pageProps.thisUser.fitbit.fitbitAvatar} />
							<p>Fitbit Name: {pageProps.thisUser.fitbit.fitbitName}</p>
						</div>
						<div>
							{isActive ? (
								<div>
									<p>
										Your Fitbit account is active so your stats are shown on the public
										app.{' '}
										<a
											href="#"
											onClick={e => {
												e.preventDefault();
												this.updateActiveStatus(pageProps.thisUser.fitbit.fitbitId, false);
											}}
										>
											Click here
										</a>{' '}
										to deactivate your account.
									</p>
								</div>
							) : (
								<div>
									<p>
										Your Fitbit account is not active so your stats are hidden from the
										public app.{' '}
										<a
											href="#"
											onClick={e => {
												e.preventDefault();
												this.updateActiveStatus(pageProps.thisUser.fitbit.fitbitId, true);
											}}
										>
											Click here
										</a>{' '}
										to activate your account.
									</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div>
						Click{' '}
						<Link href={`${config.apiUrl}/auth/fitbit`}>
							<a>here</a>
						</Link>{' '}
						to login with Fitbit
					</div>
				)}
			</div>
		);
	}
}
export default GlobalAuth(GlobalStatus(AuthedFb));
