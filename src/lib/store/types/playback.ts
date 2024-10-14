export interface PlaybackData {
	session_key: string;
	engagement: Engagement;
	drm: Drm;
	manifest: Manifest;
	status_code: string;
}

export interface Engagement {
	push_interval: number;
}

export interface Drm {
	provider: string;
	license_url: string;
	custom_headers: Record<string, string>;
}

export interface Manifest {
	url: string;
}
