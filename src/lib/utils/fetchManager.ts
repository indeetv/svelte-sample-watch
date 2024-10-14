/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseClientId } from './parseClientId';

interface FetchOptions {
	headers?: Record<string, string>;
	body?: any;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	query?: Record<string, string | number | undefined>;
}

export const fetchManager = async (
	url: string,
	options: FetchOptions = {},
	isHtml: boolean = false
) => {
	const data = await fetch(url, {
		...options,
		headers: { ...options.headers, clientId: parseClientId(), 'content-type': 'application/json' }
	});
	let fetchedData;
	if (!isHtml) {
		fetchedData = await data.json();
	} else {
		fetchedData = await data.text();
	}
	if (data.ok) {
		return {
			data: fetchedData,
			error: null
		};
	} else {
		return {
			data: null,
			error: fetchedData
		};
	}
};
