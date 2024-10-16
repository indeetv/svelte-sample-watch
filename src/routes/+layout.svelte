<script>
	import { loginStoreSnapshot } from '$lib/store/login';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import '../app.css';
	import Loader from '../components/Loader.svelte';
	import { productConfigStoreSnapshot } from '../lib/store/product-config';
	import { onMount } from 'svelte';

	onMount(async () => {
		loginStoreSnapshot.getTokenfromLocalStorage();

		await metaConfigStoreSnapshot.fetchMetaEndpoints();
		await productConfigStoreSnapshot.fetchProductConfig(
			`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.meta.product.retrieve']}?device=browser`
		);
	});
</script>

{#if $metaConfigStoreSnapshot.metaFetchedSuccessfully && $productConfigStoreSnapshot.appName}
	<slot />
{:else}
	<Loader></Loader>
{/if}

<style lang="scss">
	:global(body) {
		overflow-x: hidden;
	}

	:global(*) {
		&::-webkit-scrollbar {
			width: 8px;
			height: 8px;
		}

		&::-webkit-scrollbar-track {
			border-radius: 4px;
			background-color: #e0e0e0;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			background-color: #6c6c6c;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #555;
		}
	}
</style>
