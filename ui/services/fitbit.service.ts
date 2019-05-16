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
}
export default new FitbitService();
