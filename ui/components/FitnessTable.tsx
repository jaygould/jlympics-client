const css = require('./FitnessTable.scss');
import * as React from 'react';

import fitbitService from '../services/fitbit.service';
import generalService from '../services/general.service';

import config from '../config';

interface IProps {
	fitbitData: any;
	currentMonth: number;
}

interface IState {
	tableDate: {
		name: string | null;
		num: number | null;
	} | null;
	tableDateType: string | null;
	userData: ITableRowData[];
}

interface ITableRowData {
	steps: {
		value: number;
	};
	distance: {
		value: number;
	};
	userDetails: IUserTableData;
}

interface IUserTableData {
	first: string;
	profileImgUrl: string;
}

// TODO: refactor to add in all the types. e.g. fitbitData in props. this can be re-used in the homr and auth-fb pages. also maybe server.
// do find and replace for "any" on all pages. then make a button in adminland to refresh data using the api endpoint I made beofree, and create cron to update this each day
// then refactor to make pages and components leaner
// then STYLE

class FitnessTable extends React.Component<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			tableDate: {
				name: null,
				num: null
			},
			tableDateType: null,
			userData: []
		};
	}
	componentDidMount() {
		const { currentMonth } = this.props;
		this.updateTableMonth(currentMonth, 'init');
		this.updateTableData(currentMonth, 'init');
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
		const { fitbitData } = this.props;
		month = month && generalService.monthNextPrev(month);
		const userData = fitbitData.map(userData => {
			const summedSteps = fitbitService.countUserSteps(
				userData.monthFormattedSteps,
				month
			);
			const summedDistance = fitbitService.countUserDistance(
				userData.monthFormattedDistance,
				month
			);
			return {
				steps: summedSteps,
				distance: summedDistance,
				userDetails: userData.fbData
			};
		});
		this.setState({
			userData
		});
	}
	changeDate(tableDate: any, nextPrev: string) {
		if (tableDate && tableDate.num != null) {
			const dateNum = nextPrev == 'next' ? tableDate.num + 1 : tableDate.num - 1;
			this.updateTableMonth(dateNum, 'interact');
			this.updateTableData(dateNum, 'interact');
		}
	}
	render() {
		const { tableDate, userData } = this.state;
		return (
			<div className={css.tableWrap}>
				<div className={css.table}>
					<div className={css.tableTop}>
						<div
							className={css.tableNav}
							onClick={e => {
								e.preventDefault();
								this.changeDate(tableDate, 'prev');
							}}
						>
							&#8249;
						</div>
						<h2>{tableDate && tableDate.name && tableDate.name}</h2>
						<div
							className={css.tableNav}
							onClick={e => {
								e.preventDefault();
								this.changeDate(tableDate, 'next');
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
						{userData.map((userData, i) => {
							return (
								<div key={i} className={`${css.tableRow}`}>
									<div className={`${css.tableCell} ${css.firstCell}`}>
										{userData.userDetails.first}
									</div>
									<div className={`${css.tableCell}`}>
										{userData && userData.steps.value}
									</div>
									<div className={`${css.tableCell}`}>
										{userData && userData.distance.value}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
export default FitnessTable;
