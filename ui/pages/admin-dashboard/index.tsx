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
				<h2 className={css.example}>Dash!</h2>
				<a
					onClick={e => {
						e.preventDefault();
						fitbitService.getAllUsersFitbitData().then(resp => {
							if (resp.success) {
							} else {
								globalStatus.addMessage(resp.message);
							}
						});
					}}
				>
					Update data
				</a>
				<a
					onClick={e => {
						e.preventDefault();
						fitbitService.refreshFitbitTokens().then(resp => {
							if (resp.success) {
							} else {
								globalStatus.addMessage(resp.message);
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
