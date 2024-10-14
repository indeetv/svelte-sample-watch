export interface MetaConfig {
	endpoints: Endpoints;
	host: Host;
	status_code: string;
}

export interface Endpoints {
	'watch.meta.product.retrieve': string;
	'watch.meta.feature_support': string;
	'watch.auth.user.signup': string;
	'watch.auth.user.resend_verification': string;
	'watch.auth.session.login': string;
	'watch.auth.session.refresh': string;
	'watch.auth.session.logout': string;
	'watch.auth.session.qr.get_login_code': string;
	'watch.auth.session.qr.login': string;
	'watch.auth.session.qr.get_token': string;
	'watch.auth.password.forgot_password': string;
	'watch.auth.password.reset_password': string;
	'watch.content.brand.list': string;
	'watch.content.brand.retrieve': string;
	'watch.content.project.list': string;
	'watch.content.genre.list': string;
	'watch.content.carousel_image.list': string;
	'watch.content.swimlane.list': string;
	'watch.content.videos.list': string;
	'watch.content.project.retrieve': string;
	'watch.content.project_extra.list': string;
	'watch.content.video.retrieve': string;
	'watch.content.screener_room.retrieve': string;
	'watch.content.screener_room_video.list': string;
	'watch.content.screener.2fa': string;
	'watch.content.screener.reactivate': string;
	'watch.content.watchlist_project.add': string;
	'watch.content.watchlist_project.list': string;
	'watch.content.watchlist_project.delete': string;
	'watch.stream.session.playback': string;
	'watch.stream.session.record_offline_views': string;
	'watch.stream.view_engagement.record': string;
	'watch.stream.player_component.retrieve': string;
	'watch.stream.player_function.retrieve': string;
	'watch.content.swimlane.project.list': string;
}

export interface Host {
	name: string;
}
