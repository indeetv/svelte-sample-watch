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

	onMount(async () => {
		if ($loginStoreSnapshot.authToken) {
			videosStoreSnapshot.resetVideoStore();
			await videosStoreSnapshot.fetchVideoData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.videos.list']}`,
				$loginStoreSnapshot.authToken,
				$page.url.searchParams.get('project') || ''
			);
		} else {
			await goto('/login');
		}
	});
</script>

{#if !$videosStoreSnapshot.videoData.length}
	<Loader></Loader>
{:else}
	<Navbar></Navbar>
	<div class="flex flex-col items-center justify-center">
		<div class="p-4 font-bold text-lg text-slate-600">Select a video to watch.</div>
		<div class="w-11/12">
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
						'Screener Key': data.screening_details.screener_key || 'Not Generated'
					};
				})}
			></ContentTable>
		</div>
	</div>
{/if}
