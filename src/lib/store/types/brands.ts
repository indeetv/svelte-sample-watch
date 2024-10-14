export interface BrandEntity {
	key: string;
	keyword: string;
	name: string;
	logo: string;
	header: string;
}

export interface BrandData {
	count: number;
	next: string;
	previous: string;
	results: BrandEntity[];
}
