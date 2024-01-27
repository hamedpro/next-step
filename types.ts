export type lab = {
	title: string;
	description: string; // markdown
	file_ids: number[];
	parent_step_id: number;
};
export type resource = {
	title: string;
	link: string;
};
export type step = {
	title: string;
	description: string;
	weight: number;
	assets?: number[]; // file_ids
	prerequisites: number[];
	roadmap_id: number;
};
export type roadmap = {
	title: string;
	description: string;
};
export type roadmap_collection = { title: string; roadmaps: { id: number }[]; description: string };
export type user = {
	username: string;
	password: string;
	active_roadmap?: number;
	active_roadmap_collection?: number;
};
