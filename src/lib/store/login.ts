import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import { PUBLIC_API_KEY } from '$env/static/public';
import type { PasswordCredentials, PinCredentials } from './types/login';

function loginStore() {
	const { subscribe, update } = writable({
		authToken: '',
		refreshToken: '',
		loginErrorMessage: '',
		loginApiCalled: false,
		logoutApiCalled: false
	});

	const handleLogin = async (
		endpoint: string,
		loginPayload: PinCredentials | PasswordCredentials,
		mode: string
	) => {
		update((oldVal) => {
			return {
				...oldVal,
				loginApiCalled: true
			};
		});

		const { data, error } = await fetchManager(endpoint, {
			method: 'POST',
			body: JSON.stringify({
				type: mode,
				credentials: loginPayload,
				persist: true
			}),
			headers: { authorization: `Bearer ${PUBLIC_API_KEY}` }
		});

		if (error) {
			update((oldVal) => {
				return {
					...oldVal,
					loginErrorMessage: error.status_message || 'Server Error',
					loginApiCalled: false
				};
			});
		} else {
			const loginData = data;

			update(() => {
				return {
					authToken: loginData.token,
					refreshToken: loginData.refresh_token,
					loginErrorMessage: '',
					loginApiCalled: false,
					logoutApiCalled: false
				};
			});
			window.localStorage.setItem('token', loginData.token);
			window.localStorage.setItem('refresh_token', loginData.refresh_token);
		}
	};

	const handleLogout = async (endpoint: string, logoutPayload: { refresh_token: string }) => {
		update((oldVal) => {
			return {
				...oldVal,
				logoutApiCalled: true
			};
		});

		await fetchManager(endpoint, {
			method: 'POST',
			body: JSON.stringify({
				...logoutPayload
			}),
			headers: { authorization: `Bearer ${PUBLIC_API_KEY}` }
		});

		update(() => {
			return {
				authToken: '',
				refreshToken: '',
				loginErrorMessage: '',
				loginApiCalled: false,
				logoutApiCalled: false
			};
		});
	};

	const getTokenfromLocalStorage = () => {
		const storedToken = window.localStorage.getItem('token');
		const storedRefreshToken = window.localStorage.getItem('refresh_token');

		if (storedToken && storedRefreshToken) {
			loginStoreSnapshot.update((oldVal) => {
				return {
					...oldVal,
					authToken: storedToken,
					refreshToken: storedRefreshToken
				};
			});
		}
	};

	return {
		subscribe,
		handleLogin,
		handleLogout,
		update,
		getTokenfromLocalStorage
	};
}

export const loginStoreSnapshot = loginStore();
