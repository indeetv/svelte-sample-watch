<script>
	import { onMount } from 'svelte';
	import ContentTable from '../../components/ContentTable.svelte';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { goto } from '$app/navigation';
	import Navbar from '../../components/Navbar.svelte';
	import { projectsStoreSnapshot } from '$lib/store/projects';
	import { page } from '$app/stores';
	import { brandsStoreSnapshot } from '$lib/store/brands';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			projectsStoreSnapshot.resetProjectStore();
			await projectsStoreSnapshot.fetchProjectData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.project.list']}`,
				$loginStoreSnapshot.authToken,
				$page.url.searchParams.get('brand') || $brandsStoreSnapshot.brandData[0].key
			);
		} else {
			await goto('/login');
		}
	});
</script>

{#if !$projectsStoreSnapshot.projectData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="flex flex-col items-center justify-center">
		<div class="p-4 font-bold text-lg text-slate-600">
			Select the project to view the videos published.
		</div>
		<div class="w-11/12">
			<ContentTable
				pageToRedirect="videos"
				queryNameToAdd="project"
				tableData={$projectsStoreSnapshot.projectData}
				preserveQueryParams={`brand=${$page.url.searchParams.get('brand')}`}
			></ContentTable>
		</div>
	</div>
{/if}
