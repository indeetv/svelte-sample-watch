import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import { PUBLIC_API_KEY } from '$env/static/public';
import type { PlaybackData } from './types/playback';
import { goto } from '$app/navigation';

function playbackStore() {
	const { subscribe, update } = writable<{
		playbackData: PlaybackData;
		embeddablePlayerData: string;
		playbackApiError: string;
		embeddablePlayerApiError: string;
	}>({
		playbackData: {
			session_key: '',
			engagement: {
				push_interval: 0
			},
			drm: {
				provider: '',
				license_url: '',
				custom_headers: {}
			},
			manifest: {
				url: ''
			},
			status_code: ''
		},
		embeddablePlayerData: '',
		playbackApiError: '',
		embeddablePlayerApiError: ''
	});

	const fetchEmbeddablePlayer = async (endpoint: string) => {
		const { data, error } = await fetchManager(
			endpoint,
			{
				method: 'GET',
				headers: { authorization: `Bearer ${PUBLIC_API_KEY}` }
			},
			true
		);

		if (error) {
			console.warn('Embeddable Player Fetch Failed');
			update((oldVal) => {
				return {
					...oldVal,
					embeddablePlayerApiError: error.detail
				};
			});
		} else {
			update((oldVal) => {
				return {
					...oldVal,
					embeddablePlayerData: data
				};
			});
		}
	};

	const fetchPlaybackData = async (
		endpoint: string,
		authToken: string,
		screenerKey: string,
		browserName: string
	) => {
		const { data, error } = await fetchManager(
			endpoint.replace('<str:screener_key>', screenerKey),
			{
				method: 'POST',
				headers: { authorization: `JWT ${authToken}` },
				body: JSON.stringify({
					stream_protocol: browserName.toLowerCase() !== 'chrome' ? 'hls' : 'dash'
				})
			}
		);

		if (error) {
			console.warn('Playback Data Fetch Failed');
			if (error.status_code === 'W2003') goto('/login');

			update((oldVal) => {
				return {
					...oldVal,
					playbackApiError: error.detail
				};
			});
		} else {
			update((oldVal) => {
				return {
					...oldVal,
					playbackData: data as PlaybackData
				};
			});
		}
	};

	const resetPlaybackStore = () => {
		update(() => {
			return {
				playbackData: {
					session_key: '',
					engagement: {
						push_interval: 0
					},
					drm: {
						provider: '',
						license_url: '',
						custom_headers: {}
					},
					manifest: {
						url: ''
					},
					status_code: ''
				},
				embeddablePlayerData: '',
				playbackApiError: '',
				embeddablePlayerApiError: ''
			};
		});
	};

	return {
		subscribe,
		fetchEmbeddablePlayer,
		fetchPlaybackData,
		resetPlaybackStore
	};
}

export const playbackStoreSnapshot = playbackStore();
