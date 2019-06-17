const css = require('./index.scss');

import * as React from 'react';
import Header from '../../components/head';
import GlobalStatus from '../../components/HocGlobalStatus';

import fitbitService from '../../services/fitbit.service';
import {  IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
}

function Dashboard(props: IProps) {
  const { globalStatus } = props;

	return (
		<div>
			<Header />
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
				Update
			</a>
			<div />
		</div>
	);
}

Dashboard.getInitialProps = async () => {
	return {};
};

export default GlobalStatus(Dashboard);
