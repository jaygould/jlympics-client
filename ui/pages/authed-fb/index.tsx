import Link from 'next/link';
import * as React from 'react';

import GlobalStatus from '../../components/globalStatus';
import Header from '../../components/head';
import authService from '../../services/auth.service';
import fitbitService from '../../services/fitbit.service';
const css = require('./index.scss');

import config from '../../config';

class AuthedFb extends React.Component<
	{ pageProps: any },
	{ isActive: boolean }
> {
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
		this.setState({
			isActive: this.props.pageProps.fitbitData.isActive
		});
	}
	updateActiveStatus(fitbitId: any, activeStatus: any) {
		fitbitService.updateFitbitStatus(fitbitId, activeStatus).then(() => {
			this.setState({ isActive: activeStatus });
		});
	}
	render() {
		const { thisUser, fitbitData } = this.props.pageProps;
		const { isActive } = this.state;
		return (
			<div>
				<Header />
				<h2 className={css.example}>
					You have logged in successfully as{' '}
					{thisUser.displayName ? thisUser.displayName : 'a Facebook user'}!
				</h2>

				{thisUser.fitbit ? (
					<div>
						<div>
							<p>You are connected to your Fitbit account:</p>
							<img src={thisUser.fitbit.fitbitAvatar} />
							<p>Fitbit Name: {thisUser.fitbit.fitbitName}</p>
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
												this.updateActiveStatus(thisUser.fitbit.fitbitId, false);
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
												this.updateActiveStatus(thisUser.fitbit.fitbitId, true);
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

export default GlobalStatus(AuthedFb);
