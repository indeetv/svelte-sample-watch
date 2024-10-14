import UAParser from 'ua-parser-js';

export const parseClientId = () => {
	const parser = new UAParser();
	const userAgent = navigator.userAgent;
	parser.setUA(userAgent);
	const parserResults = parser.getResult();
	if (parserResults.os.name && parserResults.browser.name) {
		return `WEB-${parserResults.browser.name.toUpperCase()}-${
			parserResults.browser.version
		}-${parserResults.os.name.toUpperCase()}${parserResults.os.version}`;
	} else {
		return '';
	}
};
