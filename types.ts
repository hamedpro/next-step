export type resource = {
	title: string;
	link: string;
};
export type layer = step[];
export type laboratory = any;
export type step = {
	title: string;
	description: string;
	weight: number;
	id: number;
	resources: resource[];
	laboratory: laboratory;
	points_to?: number[];
};
export type roadmap = {
	layers: layer[];
	title: string;
	description: string;
};
export type store = {
	roadmaps: roadmap[];
};
