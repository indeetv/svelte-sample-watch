import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import { PUBLIC_API_KEY } from '$env/static/public';
import type { ProductConfigData } from './types/product-config';

function productConfigStore() {
	const { subscribe, update } = writable({
		companyLogo: '',
		authType: '',
		appName: ''
	});

	const fetchProductConfig = async (endpoint: string) => {
		const { data, error } = await fetchManager(endpoint, {
			headers: { authorization: `Bearer ${PUBLIC_API_KEY}` }
		});

		if (error) throw new Error('Failed to fetch product configuration');

		const productConfig = data as ProductConfigData;

		update(() => {
			return {
				companyLogo: productConfig.assets.logo_image.links[0],
				authType: productConfig.auth_type,
				appName: productConfig.app_name
			};
		});
	};

	return {
		subscribe,
		fetchProductConfig
	};
}

export const productConfigStoreSnapshot = productConfigStore();
