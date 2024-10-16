<script>
	import { onMount } from 'svelte';
	import ContentTable from '../../components/ContentTable.svelte';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { goto } from '$app/navigation';
	import Navbar from '../../components/Navbar.svelte';
	import { page } from '$app/stores';
	import { videosStoreSnapshot } from '$lib/store/videos';
	import { generateDateStringFromEpoch } from '$lib/utils/generateDateStringFromEpoch';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';
	import ContentLoader from '../../components/ContentLoader.svelte';
	import { projectsStoreSnapshot } from '$lib/store/projects';

	let paginatedCallOngoing = false;
	let selectedProject = '';

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			videosStoreSnapshot.resetVideoStore();
			selectedProject =
				(await projectsStoreSnapshot.fetchProjectDetails(
					`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.project.retrieve']}`,
					$loginStoreSnapshot.authToken,
					$page.url.searchParams.get('project') || ''
				)) || '';
			await videosStoreSnapshot.fetchVideoData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.videos.list']}`,
				$loginStoreSnapshot.authToken,
				$page.url.searchParams.get('project') || ''
			);
		} else {
			await goto('/login');
		}
	});

	const handleVideoPagination = async () => {
		paginatedCallOngoing = true;
		await videosStoreSnapshot.fetchVideoData(
			$videosStoreSnapshot.hasVideoNextUrl,
			$loginStoreSnapshot.authToken
		);
		paginatedCallOngoing = false;
	};
</script>

{#if !$videosStoreSnapshot.videoData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="mx-10">
		<div class="py-4 font-bold text-lg text-slate-600 self-start">
			Selected Project : {selectedProject}
		</div>
		<ContentTable
			pageToRedirect="viewing-room"
			queryNameToAdd="video"
			preserveQueryParams={`brand=${$page.url.searchParams.get('brand')}&project=${$page.url.searchParams.get('project')}`}
			tableData={$videosStoreSnapshot.videoData.map((data) => {
				return {
					name: data.name,
					key: data.key,
					poster: data.poster,
					'max views': data.screening_details.max_views,
					'start date': generateDateStringFromEpoch(data.screening_details.start_date),
					'expiry date': generateDateStringFromEpoch(data.screening_details.expiry_date),
					expired: data.screening_details.expired,
					'Screener Key': data.screening_details.screener_key || 'Not Generated',
					'remaining views':
						data.screening_details.max_views - data.screening_details.views_consumed
				};
			})}
			on:triggerPaginationCall={handleVideoPagination}
			hasNextUrl={$videosStoreSnapshot.hasVideoNextUrl}
			{paginatedCallOngoing}
			loadText="Load More Videos..."
		></ContentTable>
	</div>
{/if}
