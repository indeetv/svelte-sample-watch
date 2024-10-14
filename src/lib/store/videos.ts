import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import type { VideoData, VideoEntity } from './types/videos';
import { goto } from '$app/navigation';

function videosStore() {
	const { subscribe, update } = writable<{
		videoData: VideoEntity[];
		hasVideoNextUrl: string;
	}>({
		videoData: [],
		hasVideoNextUrl: ''
	});

	const fetchVideoData = async (endpoint: string, authToken: string, projectKey: string) => {
		const { data, error } = await fetchManager(endpoint.replace('<str:project_key>', projectKey), {
			method: 'GET',
			headers: { authorization: `JWT ${authToken}` }
		});

		if (error) {
			console.warn('Video Data Fetch Failed');
			if (error.status_code === 'W2003') goto('/login');
		} else {
			update(() => {
				return {
					videoData: (data as VideoData).results,
					hasVideoNextUrl: (data as VideoData).next
				};
			});
		}
	};

	const fetchVideoDetails = async (
		endpoint: string,
		authToken: string,
		projectKey: string,
		videoKey: string
	) => {
		const { data, error } = await fetchManager(
			endpoint.replace('<str:project_key>', projectKey).replace('<str:video_key>', videoKey),
			{
				method: 'GET',
				headers: { authorization: `JWT ${authToken}` }
			}
		);

		if (error) {
			console.warn('Video Details Data Fetch Failed');
			if (error.status_code === 'W2003') goto('/login');
		} else {
			return (data as VideoEntity).screening_details.screener_key;
		}
	};

	const resetVideoStore = () => {
		update(() => {
			return { videoData: [], hasVideoNextUrl: '' };
		});
	};

	return {
		subscribe,
		fetchVideoData,
		fetchVideoDetails,
		resetVideoStore
	};
}

export const videosStoreSnapshot = videosStore();
