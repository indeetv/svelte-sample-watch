export interface ProductConfigData {
	key: string;
	auth_type: string;
	refresh_token_lifetime_persist: number;
	signup_allowed: boolean;
	generic_error_message: string;
	minimum_app_version: string;
	app_name: string;
	screener_reactivation_allowed: boolean;
	extras_enabled: boolean;
	resume_playback_enabled: boolean;
	watchlist_enabled: boolean;
	assets: Assets;
	store_links: StoreLink[];
	tv_chat_session_url: string;
	status_code: string;
}

export interface Assets {
	privacy_policy_indee_pdf: PrivacyPolicyIndeePdf;
	terms_and_conditions_indee_pdf: TermsAndConditionsIndeePdf;
	terms_and_conditions_enterprise_pdf: TermsAndConditionsEnterprisePdf;
	privacy_policy_enterprise_pdf: PrivacyPolicyEnterprisePdf;
	login_background_image: LoginBackgroundImage;
	logo_image: LogoImage;
	terms_and_conditions_indee_image: TermsAndConditionsIndeeImage;
	privacy_policy_indee_image: PrivacyPolicyIndeeImage;
}

export interface PrivacyPolicyIndeePdf {
	links: string[];
	file_type: string;
}

export interface TermsAndConditionsIndeePdf {
	links: string[];
	file_type: string;
}

export interface TermsAndConditionsEnterprisePdf {
	links: string[];
	file_type: string;
}

export interface PrivacyPolicyEnterprisePdf {
	links: string[];
	file_type: string;
}

export interface LoginBackgroundImage {
	links: string[];
	file_type: string;
}

export interface LogoImage {
	links: string[];
	file_type: string;
}

export interface TermsAndConditionsIndeeImage {
	links: string[];
	file_type: string;
}

export interface PrivacyPolicyIndeeImage {
	links: string[];
	file_type: string;
}

export interface StoreLink {
	device: string;
	link: string;
}
