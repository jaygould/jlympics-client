import fetchService from './fetch.service';

class FitbitService {
	public getUserFitbitData(fbId: any): Promise<any> {
		return fetchService.isofetch(`/auth/fitbit/get-user-data`, { fbId }, 'POST');
	}
	public updateFitbitStatus(fitbitId: any, activeUpdate: boolean): Promise<any> {
		return fetchService.isofetch(
			`/auth/fitbit/update-active-status`,
			{ fitbitId, activeUpdate },
			'POST'
		);
	}
	public countUserSteps(monthFormattedSteps: any, month: any) {
		const thisMonthsStepData = monthFormattedSteps.filter((steps: any) => {
			return steps.month.num == month;
		});
		const summedSteps =
			thisMonthsStepData.length > 0
				? thisMonthsStepData[0].data.reduce((a: any, b: any) => {
						return { value: Number(a.value) + Number(b.value) };
				  })
				: 0;
		return summedSteps;
	}
	public countUserDistance(monthFormattedDistance: any, month: any) {
		const thisMonthsDistanceData = monthFormattedDistance.filter(
			(distance: any) => {
				return distance.month.num == month;
			}
		);
		const summedDistance =
			thisMonthsDistanceData.length > 0
				? thisMonthsDistanceData[0].data.reduce((a: any, b: any) => {
						return { value: Number(a.value) + Number(b.value) };
				  })
				: 0;
		return summedDistance;
	}
}
export default new FitbitService();
