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
	import ContentLoader from '../../components/ContentLoader.svelte';

	let paginatedCallOngoing = false;
	let selectedBrand = '';

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			selectedBrand =
				(await brandsStoreSnapshot.fetchBrandDetails(
					`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.brand.retrieve']}`,
					$page.url.searchParams.get('brand') || '',
					$loginStoreSnapshot.authToken
				)) || '';
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

	const handleProjectPagination = async () => {
		paginatedCallOngoing = true;
		await projectsStoreSnapshot.fetchProjectData(
			$projectsStoreSnapshot.hasProjectNextUrl,
			$loginStoreSnapshot.authToken
		);
		paginatedCallOngoing = false;
	};
</script>

{#if !$projectsStoreSnapshot.projectData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="flex flex-col items-center justify-center">
		<div class="w-11/12">
			<div class="py-4 font-bold text-lg text-slate-600 self-start">
				Selected Brand : {selectedBrand}
			</div>
			<ContentTable
				pageToRedirect="videos"
				queryNameToAdd="project"
				tableData={$projectsStoreSnapshot.projectData}
				preserveQueryParams={`brand=${$page.url.searchParams.get('brand')}`}
			></ContentTable>
			{#if $projectsStoreSnapshot.hasProjectNextUrl && !paginatedCallOngoing}
				<div class="text-center">
					<button
						class="text-blue-500 text-center p-5 underline underline-offset-2 cursor-pointer"
						on:click={handleProjectPagination}
					>
						Load More Projects...
					</button>
				</div>
			{/if}
			{#if paginatedCallOngoing}
				<ContentLoader></ContentLoader>
			{/if}
			{#if !paginatedCallOngoing && !$projectsStoreSnapshot.hasProjectNextUrl}
				<div class="mb-16"></div>
			{/if}
		</div>
	</div>
{/if}
