const css = require('./index.scss');

import Link from 'next/link';
import * as React from 'react';

import FitnessTable from '../../components/FitnessTable';
import Header from '../../components/Header';
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
interface IState {
	isActive: boolean;
}
class AuthedFb extends React.Component<IProps, IState> {
	static async getInitialProps(ctx: any) {
		const fbJwt: any = authService.fbJwtMiddleware(ctx);
		if (fbJwt) {
			// user is either coming from fb callback with token in url, or has token in their cookie
			const resp = await authService.checkAuthToken(fbJwt).then(async auth => {
				if (auth.success) {
					const thisUser = authService.parseJwt(fbJwt, true);
					const fitbitData = await fitbitService.getUserFitbitData(thisUser.fbId);
					const currentMonth = new Date().getMonth();
					return { query: ctx.query, thisUser, fitbitData, currentMonth };
				} else {
					authService.removeCookie(ctx, 'fbJwt');
					authService.redirectUser('/home', { ctx, status: 301 });
				}
				return;
			});
			return resp ? { pageProps: resp } : {};
		} else {
			authService.redirectUser('/home', { ctx, status: 301 });
		}
		return;
	}
	constructor(props: any) {
		super(props);
		this.state = {
			isActive: false
		};
	}
	componentDidMount() {
		const { globalAuth, pageProps } = this.props;
		const isActive = pageProps.fitbitData.isActive;
		this.setState({
			isActive
		});
		setTimeout(() => {
			// settimeout is needed to run the addUserDetails function after the authContext
			// is rendered in the HoC.
			globalAuth.addUserDetails({
				displayName: pageProps.thisUser.displayName,
				displayPhoto: pageProps.thisUser.userPhoto
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
		const { thisUser } = pageProps;
		return (
			<div>
				<Header />
				<main>
					{!thisUser.fitbit && (
						<React.Fragment>
							<div className={`${css.iconWrap}`}>
								<div className={`${css.iconInner} ${css.red}`}>
									<img className={css.fitnessIcon} src="/static/icons/fitness.svg" />
								</div>
							</div>

							<p>
								You are logged in as{' '}
								{thisUser.displayName ? thisUser.displayName : 'a Facebook user'} but
								have not linked to your Fitbit account.
							</p>
							<p>
								{' '}
								Click{' '}
								<Link href={`${config.apiUrl}/auth/fitbit`}>
									<a>here</a>
								</Link>{' '}
								to login with Fitbit
							</p>
						</React.Fragment>
					)}

					{thisUser.fitbit ? (
						<React.Fragment>
							<div className={`${css.iconWrap}`}>
								<div className={`${css.iconInner} ${css.green}`}>
									<img className={css.fitnessIcon} src="/static/icons/fitbitWatch.svg" />
								</div>
							</div>

							<div>
								<p>You are connected to your Fitbit account as:</p>
								<div className={css.fitbitName}>
									<p>{thisUser.fitbit.fitbitName}</p>
								</div>
							</div>
							<div>
								{isActive ? (
									<div>
										<p>
											Your Fitbit account is active so your stats are shown on the public
											app.
											<br />
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
											public app.
											<br />
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
							<FitnessTable
								fitbitData={pageProps.fitbitData}
								currentMonth={pageProps.currentMonth}
							/>
						</React.Fragment>
					) : null}
				</main>
			</div>
		);
	}
}
export default GlobalAuth(GlobalStatus(AuthedFb));
