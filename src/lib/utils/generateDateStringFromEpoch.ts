export const generateDateStringFromEpoch = (epoch: number) => {
	if (epoch) {
		const date = new Date(0);
		date.setUTCSeconds(epoch);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	} else return '';
};
