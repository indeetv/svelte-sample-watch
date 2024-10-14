import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import type { ProjectData, ProjectEntity } from './types/projects';
import { loginStoreSnapshot } from './login';

function projectsStore() {
	const { subscribe, update } = writable<{
		projectData: ProjectEntity[];
		hasProjectNextUrl: string;
	}>({
		projectData: [],
		hasProjectNextUrl: ''
	});

	const fetchProjectData = async (endpoint: string, authToken: string, brandKey?: string) => {
		const { data, error } = await fetchManager(
			`${endpoint}${brandKey ? `?brand=${brandKey}` : ''}`,
			{
				method: 'GET',
				headers: { authorization: `JWT ${authToken}` }
			}
		);

		if (error) {
			console.warn('Project Data Fetch Failed');
			if (error.status_code === 'W2003') {
				loginStoreSnapshot.handleTokenExpiry();
			}
		} else {
			update((oldVal) => {
				return {
					projectData: [...oldVal.projectData, ...(data as ProjectData).results],
					hasProjectNextUrl: (data as ProjectData).next
				};
			});
		}
	};

	const resetProjectStore = () => {
		update(() => {
			return {
				projectData: [],
				hasProjectNextUrl: ''
			};
		});
	};

	return {
		subscribe,
		fetchProjectData,
		resetProjectStore
	};
}

export const projectsStoreSnapshot = projectsStore();
