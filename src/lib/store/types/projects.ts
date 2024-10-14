export interface ProjectEntity {
	key: string;
	name: string;
	poster: string;
}

export interface ProjectData {
	count: number;
	next: string;
	previous: string;
	results: ProjectEntity[];
}

export interface ProjectCard {
	id: string;
	altText: string;
	title: string;
	posterLink: string;
}
