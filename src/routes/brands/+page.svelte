<script>
	import { onMount } from 'svelte';
	import ContentTable from '../../components/ContentTable.svelte';
	import { brandsStoreSnapshot } from '../../lib/store/brands';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { goto } from '$app/navigation';
	import Navbar from '../../components/Navbar.svelte';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import ContentLoader from '../../components/ContentLoader.svelte';

	let paginatedCallOngoing = false;

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			brandsStoreSnapshot.resetBrandStore();
			await brandsStoreSnapshot.fetchBrandData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.brand.list']}`,
				$loginStoreSnapshot.authToken
			);
		} else {
			await goto('/login');
		}
	});

	const handleBrandsPagination = async () => {
		paginatedCallOngoing = true;
		await brandsStoreSnapshot.fetchBrandData(
			$brandsStoreSnapshot.hasNextUrl,
			$loginStoreSnapshot.authToken
		);
		paginatedCallOngoing = false;
	};
</script>

{#if !$brandsStoreSnapshot.brandData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="flex flex-col items-center justify-center p-5">
		<div class="p-4 font-bold text-lg text-slate-600">
			Select the brand whose content you want to see.
		</div>
		<ContentTable
			pageToRedirect="projects"
			queryNameToAdd="brand"
			tableData={$brandsStoreSnapshot.brandData}
			on:triggerPaginationCall={handleBrandsPagination}
			hasNextUrl={$brandsStoreSnapshot.hasNextUrl}
			{paginatedCallOngoing}
			loadText="Load More Brands..."
		></ContentTable>
	</div>
{/if}
