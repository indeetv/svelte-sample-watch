<script>
	import { loginStoreSnapshot } from '$lib/store/login';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import '../app.css';
	import { productConfigStoreSnapshot } from '../lib/store/product-config';
	import { onMount } from 'svelte';

	onMount(async () => {
		await metaConfigStoreSnapshot.fetchMetaEndpoints();
		await productConfigStoreSnapshot.fetchProductConfig(
			`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.meta.product.retrieve']}?device=browser`
		);
	});
</script>

<slot />
