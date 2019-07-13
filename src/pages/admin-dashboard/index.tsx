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
}

class Dashboard extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.state = { dataUpdated: null };
	}

	render() {
		const { globalStatus } = this.props;
		const { dataUpdated } = this.state;

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
									this.setState({ dataUpdated: resp.updated });
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
								} else {
									globalStatus.addMessage('Something went wrong.');
								}
							});
						}}
					>
						Refresh tokens
					</a>
					<div />
					<div>
						{/* map over each month... */}
						{dataUpdated &&
							dataUpdated.length &&
							dataUpdated.map((data: any, i: any) => {
								// then map over each user in that month
								return data.map((user: any) => {
									const monthName = generalService.monthFormatter(user.month);
									return (
										<div key={i}>
											<h3>{monthName}</h3>
											<p className={css.updateRespData}>User: {user.fitbitName}</p>
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
					</div>
				</main>
			</div>
		);
	}
}

export default GlobalStatus(GlobalErrorHandler(Dashboard));
