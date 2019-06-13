import * as React from 'react';

import fitbitService from '../../services/fitbit.service';

import FitnessTable from '../../components/FitnessTable';
import Header from '../../components/head';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';

const css = require('./index.scss');

import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
	globalAuth: IGlobalAuth;
	fitbitData: any;
	currentMonth: any;
}
class Home extends React.Component<IProps, {}> {
	static async getInitialProps(ctx: any) {
		const fitbitData = await fitbitService.getActiveUsersFitbitData();
		const currentMonth = new Date().getMonth();
		return { query: ctx.query, fitbitData, currentMonth };
	}
	render() {
		const { fitbitData, currentMonth } = this.props;
		return (
			<div>
				<Header />
				<h2 className={css.example}>Welcome to Jlympics!</h2>
				<FitnessTable fitbitData={fitbitData} currentMonth={currentMonth} />
			</div>
		);
	}
}

export default GlobalAuth(GlobalStatus(Home));
