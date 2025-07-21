<script>
	import { onMount } from 'svelte';
	import { loginStoreSnapshot } from '$lib/store/login';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { videosStoreSnapshot } from '$lib/store/videos';
	import { playbackStoreSnapshot } from '$lib/store/playback';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	// @ts-ignore
	import UAParser from 'ua-parser-js';
	import Loader from '../../components/Loader.svelte';
	import { metaConfigStoreSnapshot } from '$lib/store/meta-config';

	const baseUrl = PUBLIC_API_ENDPOINT || '';
	let browserName = '';
	let videoKey = $page.url.searchParams.get('video');
	let projectKey = $page.url.searchParams.get('project');
	let screenerKey = '';
	let currentSelectedVideoDetails;

	onMount(async () => {
		parseBrowserName();

		if ($loginStoreSnapshot.authToken) {
			playbackStoreSnapshot.resetPlaybackStore();

			currentSelectedVideoDetails = (await videosStoreSnapshot.fetchVideoDetails(
							`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.content.video.retrieve']}`,
							$loginStoreSnapshot.authToken,
							projectKey,
							videoKey
						)) || '';
			
			screenerKey = currentSelectedVideoDetails.screening_details.screener_key;


			await playbackStoreSnapshot.fetchEmbeddablePlayer(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.stream.player_component.retrieve']}`
			);
			await playbackStoreSnapshot.fetchPlaybackData(
				`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.stream.session.playback']}`,
				$loginStoreSnapshot.authToken,
				screenerKey,
				browserName
			);

			console.warn($playbackStoreSnapshot.embeddablePlayerData);

			if (
				!$playbackStoreSnapshot.playbackApiError &&
				!$playbackStoreSnapshot.embeddablePlayerApiError
			) {
				// @ts-ignore
				window.initializeIndeePlayer(
					'video_player',
					{
						playbackSourcesData: 
						{	
							drm: $playbackStoreSnapshot.playbackData.drm,
							manifest: $playbackStoreSnapshot.playbackData.manifest,
							defaultSubtitle: currentSelectedVideoDetails.subtitles[0]?.label || ''
						},
						playbackMode: browserName.toLowerCase() !== 'chrome' ? 'hls' : 'dash',
						overlayWatermarkDetails: currentSelectedVideoDetails.overlay_watermark_details,
						savePlayerPreferences: true,
						resumeDetails: {
							from_second: currentSelectedVideoDetails.resume_playback?.from_second || 0,
							duration_in_sec: currentSelectedVideoDetails.duration_in_sec
						},
						engagementData: {
							push_interval: $playbackStoreSnapshot.playbackData.engagement.push_interval,
							endpointUrl: baseUrl+$metaConfigStoreSnapshot.endpoints['watch.stream.view_engagement.record'] + '?'
						}
					},
					$playbackStoreSnapshot.embeddablePlayerData,
					currentSelectedVideoDetails.key,
					{ autoPlay: true }
				);
			}
		} else {
			await goto('/login');
		}
	});

	const parseBrowserName = () => {
		const parser = new UAParser();
		const userAgent = navigator.userAgent;
		parser.setUA(userAgent);
		const parserResults = parser.getResult();
		browserName = parserResults.browser.name || '';
	};
</script>

<svelte:head>
	<script
		src={`${$metaConfigStoreSnapshot.host}${$metaConfigStoreSnapshot.endpoints['watch.stream.player_function.retrieve']}`}
	></script>
</svelte:head>

{#if (!$playbackStoreSnapshot.playbackData.drm.license_url || !$playbackStoreSnapshot.embeddablePlayerData) && !$playbackStoreSnapshot.playbackApiError && !$playbackStoreSnapshot.embeddablePlayerApiError}
	<Loader></Loader>
{:else if $playbackStoreSnapshot.playbackApiError}
	<p class="w-screen h-screen flex items-center justify-center font-semibold text-lg">
		{$playbackStoreSnapshot.playbackApiError}
	</p>
{:else if $playbackStoreSnapshot.embeddablePlayerApiError}
	<p class="w-screen h-screen flex items-center justify-center font-semibold text-lg">
		{$playbackStoreSnapshot.embeddablePlayerApiError}
	</p>
{:else}
	<div class="h-[100svh] w-[100svw]">
		<iframe title="videoPlayback" id="video_player" allow="autoplay" width="100%" height="100%"
		></iframe>
	</div>
{/if}
