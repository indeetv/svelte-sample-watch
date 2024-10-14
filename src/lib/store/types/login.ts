export interface LoginData {
	type: string;
	credentials: PinCredentials | PasswordCredentials;
	persist: boolean;
}

export interface PinCredentials {
	pin: string;
}

export interface PasswordCredentials {
	username: string;
	password: string;
}
