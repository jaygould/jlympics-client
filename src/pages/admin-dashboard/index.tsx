const css = require('./index.scss');

import * as React from 'react';
import Header from '../../components/Header';
import GlobalErrorHandler from '../../components/HocGlobalErrorHandler';
import GlobalStatus from '../../components/HocGlobalStatus';

import fitbitService from '../../services/fitbit.service';
import generalService from '../../services/general.service';
import { IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
}

interface IState {
	dataUpdated: any;
	tokensUpdated: any;
}

class Dashboard extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.state = { dataUpdated: null, tokensUpdated: null };
	}

	render() {
		const { globalStatus } = this.props;
		const { dataUpdated, tokensUpdated } = this.state;

		return (
			<div>
				<Header />
				<main>
					<a
						className={css.adminBtn}
						onClick={e => {
							e.preventDefault();
							fitbitService.getAllUsersFitbitData().then(resp => {
								if (resp.success) {
									globalStatus.addMessage('Success!');
									this.setState({ tokensUpdated: null, dataUpdated: resp.updated });
								} else {
									globalStatus.addMessage('Something went wrong.');
								}
							});
						}}
					>
						Update data
					</a>
					<a
						className={css.adminBtn}
						onClick={e => {
							e.preventDefault();
							fitbitService.refreshFitbitTokens().then(resp => {
								if (resp.success) {
									globalStatus.addMessage('Success!');
									this.setState({ dataUpdated: null, tokensUpdated: resp.response });
								} else {
									globalStatus.addMessage('Something went wrong.');
								}
							});
						}}
					>
						Refresh tokens
					</a>
					<div />
					<div className={css.dataGroup}>
						{/* map over each month... */}
						{dataUpdated &&
							dataUpdated.length &&
							dataUpdated.map((data: any, i: any) => {
								// then map over each user in that month
								return data.map((user: any) => {
									const monthName = generalService.monthFormatter(user.month);
									return (
										<div className={css.dataBlock} key={i}>
											<h3>{monthName}</h3>
											<p className={css.updateRespData}>User: {user.user.fitbitName}</p>
											<p className={css.updateRespData}>
												Success: {user.success ? 'true' : 'false'}
											</p>
											<p className={css.updateRespData}>
												Reason: {user.reason === 'auth' ? 'Authentication' : 'Unknown'}
											</p>
										</div>
									);
								});
							})}
						{tokensUpdated &&
							tokensUpdated.length &&
							tokensUpdated.map((data: any, i: any) => {
								return (
									<div className={css.dataBlock} key={i}>
										<p className={css.updateRespData}>User: {data.userName}</p>
										<p className={css.updateRespData}>
											Success: {data.success ? 'true' : 'false'}
										</p>
										{data.reason && (
											<p className={css.updateRespData}>
												Reason: {data.reason === 'token' ? 'Refresh token' : 'Unknown'}
											</p>
										)}
									</div>
								);
							})}
					</div>
				</main>
			</div>
		);
	}
}

export default GlobalStatus(GlobalErrorHandler(Dashboard));
