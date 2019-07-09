import * as React from 'react';

import fitbitService from '../../services/fitbit.service';

import FitnessTable from '../../components/FitnessTable';
import Header from '../../components/Header';
import GlobalAuth from '../../components/HocGlobalAuth';
import GlobalErrorHandler from '../../components/HocGlobalErrorHandler';
import GlobalStatus from '../../components/HocGlobalStatus';

import { IGlobalAuth, IGlobalStatus } from '../../types/global.types';

// TODO: check if the npmrc file fixed the EB problem. find out exactly what was needed so can write blog post. Info below:
// * Add port 8081 to index JS file
// * Add .npmrc file with the following: # Force npm to run node-gyp also as root, preventing permission denied errors in AWS with npm@5 unsafe-perm=true
// * Add ENV VAR https://stackoverflow.com/questions/52611634/deploy-nodejs-with-elastic-beanstalk-permission-problem/52628534#52628534
// * With Next, ensure -p is added to specify the port which nginx uses (8010)

// TODO: then find out where to put PEM file (.ssh?) and add that to list of points for blog
// TODO: then carry on by looking through uncommitted sever code and perhaps add more types?
// TODO: then link up real URL with the beanstalk, then add the URLs to the env vars for each EC2 instance
// TODO: then look in to EB CLI and see what can be done there in terms of deployment etc
// TODO: then reverse proxy then docker
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
		return { query: ctx.query, fitbitData, currentMonth };
	}
	render() {
		const { fitbitData, currentMonth } = this.props;
		return (
			<React.Fragment>
				<Header />
				<main>
					{fitbitData && currentMonth ? (
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
