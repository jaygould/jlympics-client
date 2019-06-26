const css = require('./FitnessTable.scss');
import * as React from 'react';

import fitbitService from '../services/fitbit.service';
import generalService from '../services/general.service';

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
		const userData = fitbitData.map((userData: any) => {
			const summedSteps = fitbitService.countUserSteps(
				userData.monthFormattedSteps,
				month
			);
			const summedDistance = fitbitService.countUserDistance(
				userData.monthFormattedDistance,
				month
			);
			return {
				steps: this.roundNumber(summedSteps),
				distance: this.roundNumber(summedDistance),
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
	formatData(count: any) {
		return count ? count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
	}
	roundNumber(data: any) {
		return Math.round(data.value * 100) / 100;
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
							<img
								className={`${css.tableArrow} ${css.arrowLeft}`}
								src="/static/icons/arrow-left.svg"
							/>
						</div>
						<h2>{tableDate && tableDate.name && tableDate.name}</h2>
						<div
							className={css.tableNav}
							onClick={e => {
								e.preventDefault();
								this.changeDate(tableDate, 'next');
							}}
						>
							<img
								className={`${css.tableArrow} ${css.arrowRight}`}
								src="/static/icons/arrow-right.svg"
							/>
						</div>
					</div>
					<div className={`${css.tableRow} ${css.tableHead}`}>
						<div className={`${css.tableCell} ${css.tableTop} ${css.firstCell}`}>
							-
						</div>
						<div className={`${css.tableCell} ${css.tableTop}`}>
							<img className={`${css.tableHeadIcon}`} src="/static/icons/steps.svg" />
							Steps
						</div>
						<div className={`${css.tableCell} ${css.tableTop}`}>
							<img
								className={`${css.tableHeadIcon}`}
								src="/static/icons/distance.svg"
							/>
							Distance (km)
						</div>
					</div>
					<div className={css.tableBody}>
						{userData.map((userData, i) => {
							return (
								<div key={i} className={`${css.tableRow}`}>
									<div className={`${css.tableCell} ${css.firstCell}`}>
										<span>{userData.userDetails.first}</span>
										<div className={css.tableImageWrap}>
											<img src={userData.userDetails.profileImgUrl} />
										</div>
									</div>
									<div className={`${css.tableCell}`}>
										{userData && this.formatData(userData.steps)}
									</div>
									<div className={`${css.tableCell}`}>
										{userData && this.formatData(userData.distance)}
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
