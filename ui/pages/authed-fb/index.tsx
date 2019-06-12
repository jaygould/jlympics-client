const css = require('./index.scss');

import Link from 'next/link';
import * as React from 'react';

import Header from '../../components/head';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';
import authService from '../../services/auth.service';
import fitbitService from '../../services/fitbit.service';
import generalService from '../../services/general.service';
import { IGlobalAuth } from '../../types/global.types';

import config from '../../config';

// TODO: REFACTOR THIS PAGE SO THE TABLE IS IN OWN COMPONENT AND SEE IF IT CAN BE REFACTORED A LITTLE BETTER FGENERALE

interface IProps {
	globalAuth: IGlobalAuth;
	pageProps: any;
}
interface IState {
	tableDate: {
		name: string | null;
		num: number | null;
	} | null;
	tableDateType: string | null;
	isActive: boolean;
	currentTableData: {
		steps: number | null;
		distance: number | null;
	} | null;
}
class AuthedFb extends React.Component<IProps, IState> {
	static async getInitialProps(ctx: any) {
		const fbJwt: any = authService.fbJwtMiddleware(ctx);
		if (fbJwt) {
			// user is either coming from fb callback with token in url, or has token in their cookie
			const resp = await authService.checkAuthToken(fbJwt).then(async auth => {
				if (auth.success) {
					const thisUser = authService.parseJwt(fbJwt, true);
					const userData = await fitbitService.getUserFitbitData(thisUser.fbId);
					const currentMonth = new Date().getMonth();
					return { query: ctx.query, thisUser, userData, currentMonth };
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
			tableDate: {
				name: null,
				num: null
			},
			tableDateType: null,
			isActive: false,
			currentTableData: {
				steps: null,
				distance: null
			}
		};
	}
	componentDidMount() {
		const { globalAuth, pageProps } = this.props;
		const fitbitData = pageProps.userData;
		this.setState({
			isActive: fitbitData.isActive
		});
		this.updateTableMonth(pageProps.currentMonth, 'init');
		this.updateTableData(pageProps.currentMonth, 'init');
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
	updateTableMonth(month: number | null, updateType: string) {
		month = month && generalService.monthNextPrev(month);
		const monthName = generalService.monthFormatter(month);
		this.setState({
			tableDate: {
				name: monthName,
				num: month
			},
			tableDateType: 'month'
		});
	}
	updateTableData(month: number | null, updateType: string) {
		const { pageProps } = this.props;
		const fitbitData = pageProps.userData;
		month = month && generalService.monthNextPrev(month);
		const thisMonthsStepData = fitbitData.monthFormattedSteps.filter(
			(steps: any) => {
				return steps.month.num == month;
			}
		);
		const summedSteps =
			thisMonthsStepData.length > 0
				? thisMonthsStepData[0].data.reduce((a: any, b: any) => {
						return { value: Number(a.value) + Number(b.value) };
				  })
				: 0;

		const thisMonthsDistanceData = fitbitData.monthFormattedDistance.filter(
			(distance: any) => {
				return distance.month.num == month;
			}
		);
		const summedDistance =
			thisMonthsDistanceData.length > 0
				? thisMonthsDistanceData[0].data.reduce((a: any, b: any) => {
						return { value: Number(a.value) + Number(b.value) };
				  })
				: 0;

		this.setState({
			currentTableData: {
				steps: summedSteps.value,
				distance: summedDistance.value
			}
		});
	}
	render() {
		const { pageProps } = this.props;
		const { isActive, tableDate, currentTableData } = this.state;
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
						<div className={css.tableWrap}>
							<div className={css.table}>
								<div className={css.tableTop}>
									<div
										className={css.tableNav}
										onClick={e => {
											e.preventDefault();
											if (tableDate && tableDate.num != null) {
												const dateNum = tableDate.num;
												this.updateTableMonth(dateNum - 1, 'interact');
												this.updateTableData(dateNum - 1, 'interact');
											}
										}}
									>
										&#8249;
									</div>
									<h2>{tableDate && tableDate.name && tableDate.name}</h2>
									<div
										className={css.tableNav}
										onClick={e => {
											e.preventDefault();
											if (tableDate && tableDate.num != null) {
												const dateNum = tableDate.num;
												this.updateTableMonth(dateNum + 1, 'interact');
												this.updateTableData(dateNum + 1, 'interact');
											}
										}}
									>
										&#8250;
									</div>
								</div>
								<div className={`${css.tableRow} ${css.tableHead}`}>
									<div className={`${css.tableCell} ${css.tableTop} ${css.firstCell}`}>
										-
									</div>
									<div className={`${css.tableCell} ${css.tableTop}`}>Steps</div>
									<div className={`${css.tableCell} ${css.tableTop}`}>Distance</div>
								</div>
								<div className={css.tableBody}>
									<div className={`${css.tableRow}`}>
										<div className={`${css.tableCell} ${css.firstCell}`}>Person 1</div>
										<div className={`${css.tableCell}`}>
											{currentTableData && currentTableData.steps}
										</div>
										<div className={`${css.tableCell}`}>
											{currentTableData && currentTableData.distance}
										</div>
									</div>
								</div>
							</div>
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
