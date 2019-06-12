import * as React from 'react';

import fitbitService from '../../services/fitbit.service';

import Header from '../../components/head';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalStatus from '../../components/HocGlobalStatus';

const css = require('./index.scss');

import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

interface IProps {
	globalStatus: IGlobalStatus;
	globalAuth: IGlobalAuth;
	pageProps: any;
}
class Home extends React.Component<IProps, {}> {
	static async getInitialProps(ctx: any) {
		const fitbitData = await fitbitService.getActiveUsersFitbitData();
		const currentMonth = new Date().getMonth();
		return { query: ctx.query, fitbitData, currentMonth };
	}
	render() {
		const {} = this.props;
		return (
			<div>
				<Header />
				<h2 className={css.example}>Welcome to Jlympics!</h2>
			</div>
		);
	}
}

export default GlobalAuth(GlobalStatus(Home));
