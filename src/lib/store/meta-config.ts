import { writable } from 'svelte/store';
import { fetchManager } from '$lib/utils/fetchManager';
import { PUBLIC_API_KEY, PUBLIC_API_ENDPOINT } from '$env/static/public';
import type { Endpoints, MetaConfig } from './types/meta-config';

function metaConfigStore() {
	const { subscribe, update } = writable<{
		endpoints: Endpoints;
		metaFetchedSuccessfully: boolean;
		host: string;
	}>({
		endpoints: {
			'watch.meta.product.retrieve': '',
			'watch.meta.feature_support': '',
			'watch.auth.user.signup': '',
			'watch.auth.user.resend_verification': '',
			'watch.auth.session.login': '',
			'watch.auth.session.refresh': '',
			'watch.auth.session.logout': '',
			'watch.auth.session.qr.get_login_code': '',
			'watch.auth.session.qr.login': '',
			'watch.auth.session.qr.get_token': '',
			'watch.auth.password.forgot_password': '',
			'watch.auth.password.reset_password': '',
			'watch.content.brand.list': '',
			'watch.content.brand.retrieve': '',
			'watch.content.project.list': '',
			'watch.content.genre.list': '',
			'watch.content.carousel_image.list': '',
			'watch.content.swimlane.list': '',
			'watch.content.videos.list': '',
			'watch.content.project.retrieve': '',
			'watch.content.project_extra.list': '',
			'watch.content.video.retrieve': '',
			'watch.content.screener_room.retrieve': '',
			'watch.content.screener_room_video.list': '',
			'watch.content.screener.2fa': '',
			'watch.content.screener.reactivate': '',
			'watch.content.watchlist_project.add': '',
			'watch.content.watchlist_project.list': '',
			'watch.content.watchlist_project.delete': '',
			'watch.stream.session.playback': '',
			'watch.stream.session.record_offline_views': '',
			'watch.stream.view_engagement.record': '',
			'watch.stream.player_component.retrieve': '',
			'watch.stream.player_function.retrieve': '',
			'watch.content.swimlane.project.list': ''
		},
		metaFetchedSuccessfully: false,
		host: ''
	});

	const fetchMetaEndpoints = async () => {
		const { data, error } = await fetchManager(
			`${PUBLIC_API_ENDPOINT}v2/watch/meta/endpoints?device=browser`,
			{
				headers: { authorization: `Bearer ${PUBLIC_API_KEY}` }
			}
		);

		if (error) {
			console.warn('Failed to fetch Meta configuration');
			update((oldVal) => {
				return {
					...oldVal,
					metaFetchedSuccessfully: false
				};
			});
		} else {
			update(() => {
				return {
					endpoints: (data as MetaConfig).endpoints,
					host: (data as MetaConfig).host.name,
					metaFetchedSuccessfully: true
				};
			});
		}
	};

	return {
		subscribe,
		fetchMetaEndpoints
	};
}

export const metaConfigStoreSnapshot = metaConfigStore();
