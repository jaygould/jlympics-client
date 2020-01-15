import * as React from 'react';

import fitbitService from '../../services/fitbit.service';

import FitnessTable from '../../components/FitnessTable';
import Header from '../../components/Header';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalErrorHandler from '../../components/HocGlobalErrorHandler';
import GlobalStatus from '../../components/HocGlobalStatus';

import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
	globalAuth: IGlobalAuth;
	fitbitData: any;
	currentMonth: any;
}
class Home extends React.Component<IProps, {}> {
	static async getInitialProps(ctx: any) {
		let fitbitData;
		try {
			fitbitData = await fitbitService.getActiveUsersFitbitData();
		} catch (e) {
			return { query: ctx.query, fitbitData: null, currentMonth: null };
		}
		const currentMonth = new Date().getMonth();
		console.log(currentMonth);
		console.log(fitbitData);
		return { query: ctx.query, fitbitData, currentMonth };
	}
	render() {
		const { fitbitData, currentMonth } = this.props;
		return (
			<React.Fragment>
				<Header />
				<main>
					{fitbitData && currentMonth >= 0 ? (
						<FitnessTable fitbitData={fitbitData} currentMonth={currentMonth} />
					) : (
						<p>There is no data to view. There may be a server connection problem.</p>
					)}
				</main>
			</React.Fragment>
		);
	}
}

export default GlobalAuth(GlobalStatus(GlobalErrorHandler(Home)));
