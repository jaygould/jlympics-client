const css = require('./index.scss');

import * as React from 'react';
import Header from '../../components/Header';
import GlobalStatus from '../../components/HocGlobalStatus';

import fitbitService from '../../services/fitbit.service';
import { IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
}

function Dashboard(props: IProps) {
	const { globalStatus } = props;

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
			</main>
		</div>
	);
}

Dashboard.getInitialProps = async () => {
	return {};
};

export default GlobalStatus(Dashboard);
