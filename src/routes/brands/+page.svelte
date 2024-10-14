<script>
	import { onMount } from 'svelte';
	import ContentTable from '../../components/ContentTable.svelte';
	import { brandsStoreSnapshot } from '../../lib/store/brands';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { goto } from '$app/navigation';
	import Navbar from '../../components/Navbar.svelte';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import { browser } from '$app/environment';

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			await brandsStoreSnapshot.fetchBrandData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.brand.list']}`,
				$loginStoreSnapshot.authToken
			);
		} else {
			await goto('/login');
		}
	});
</script>

{#if !$brandsStoreSnapshot.brandData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="flex flex-col items-center justify-center">
		<div class="p-4 font-bold text-lg text-slate-600">
			Select the brand whose content you want to see.
		</div>
		<div class="w-11/12">
			<ContentTable
				pageToRedirect="projects"
				queryNameToAdd="brand"
				tableData={$brandsStoreSnapshot.brandData}
			></ContentTable>
		</div>
	</div>
{/if}
