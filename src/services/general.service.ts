class GeneralService {
	public monthFormatter(theMonth: any) {
		const month = new Array();
		month[0] = 'January';
		month[1] = 'February';
		month[2] = 'March';
		month[3] = 'April';
		month[4] = 'May';
		month[5] = 'June';
		month[6] = 'July';
		month[7] = 'August';
		month[8] = 'September';
		month[9] = 'October';
		month[10] = 'November';
		month[11] = 'December';
		return month[theMonth];
	}
	public monthNextPrev(month: number) {
		if (month && month < 0) {
			month = 11;
		} else if (month == 12) {
			month = 0;
		}
		return month;
	}
}

export default new GeneralService();
