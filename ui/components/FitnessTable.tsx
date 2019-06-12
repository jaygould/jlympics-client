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
	currentTableData: {
		steps: number | null;
		distance: number | null;
	} | null;
}

class FitnessTable extends React.Component<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			tableDate: {
				name: null,
				num: null
			},
			tableDateType: null,
			currentTableData: {
				steps: null,
				distance: null
			}
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
		const summedSteps = fitbitService.countUserSteps(
			fitbitData.monthFormattedSteps,
			month
		);
		const summedDistance = fitbitService.countUserDistance(
			fitbitData.monthFormattedDistance,
			month
		);
		this.setState({
			currentTableData: {
				steps: summedSteps.value,
				distance: summedDistance.value
			}
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
		const { tableDate, currentTableData } = this.state;
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
						<div className={`${css.tableRow}`}>
							<div className={`${css.tableCell} ${css.firstCell}`}>Person 1</div>
							<div className={`${css.tableCell}`}>
								{currentTableData && currentTableData.steps}
							</div>
							<div className={`${css.tableCell}`}>
								{currentTableData && currentTableData.distance}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default FitnessTable;
