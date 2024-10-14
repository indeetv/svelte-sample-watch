export interface ScreeningDetails {
	screener_key: string;
	expired: boolean;
	max_views: number;
	views_consumed: number;
	start_date: number;
	expiry_date: number;
	offline: boolean;
}

export interface ResumeDetails {
	from_second?: number;
}

export interface AuthDetails {
	mode: string;
	ident: {
		country_code: number;
		phone: number;
	};
}

export interface CastAndCrewEntity {
	name: string;
	role: string;
}

export interface OverlayDetails {
	text: string;
	opacity: number;
	position: string;
	interval_in_seconds: number;
	image_link: string;
}

export interface VideoEntity {
	key: string;
	name: string;
	poster: string;
	duration_in_sec: number;
	cast_and_crew: Record<string, string>[];
	description: string;
	subtitles: Record<string, string>[];
	is_cmaf_enabled: boolean;
	season: number;
	episode: number;
	original_air_date: number;
	screening_details: ScreeningDetails;
	auth_details: AuthDetails;
	overlay_watermark_details: OverlayDetails;
	resume_playback: ResumeDetails;
}

export interface VideoData {
	count: number;
	next: string;
	previous: string;
	results: VideoEntity[];
	status_code: string;
}

export interface VideoCard {
	id: string;
	durationLeft: number;
	vidTitle: string;
	expiryText: string;
	remainingViews: number;
	videoProgress: number;
	vidPosterLink: string;
	is4k: boolean;
	isAd: boolean;
	is2fa: boolean;
	isDownloadable: boolean;
	description: string;
	cast_and_crew: CastAndCrewEntity[];
	hasExpired: boolean;
	hasExpiredText: string;
	originalAirDate: string;
	isFutureDated: boolean;
	isFutureDatedText: string;
	canRequestReactivation: boolean;
	wasPlayedPreviously: boolean;
}
