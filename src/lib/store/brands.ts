import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import type { BrandData, BrandEntity } from './types/brands';
import { loginStoreSnapshot } from './login';

function brandsStore() {
	const { subscribe, update } = writable<{
		brandData: BrandEntity[];
		hasNextUrl: string;
	}>({
		brandData: [],
		hasNextUrl: ''
	});

	const fetchBrandData = async (endpoint: string, authToken: string) => {
		const { data, error } = await fetchManager(endpoint, {
			method: 'GET',
			headers: { authorization: `JWT ${authToken}` }
		});

		if (error) {
			console.warn('Brand Data Fetch Failed');
			if (error.status_code === 'W2003') {
				loginStoreSnapshot.handleTokenExpiry();
			}
		} else {
			update((oldVal) => {
				return {
					brandData: [...oldVal.brandData, ...(data as BrandData).results],
					hasNextUrl: (data as BrandData).next
				};
			});
		}
	};

	const resetBrandStore = () => {
		update(() => {
			return {
				brandData: [],
				hasNextUrl: ''
			};
		});
	};

	return {
		subscribe,
		fetchBrandData,
		resetBrandStore
	};
}

export const brandsStoreSnapshot = brandsStore();
