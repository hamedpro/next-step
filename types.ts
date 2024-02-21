export interface asset {
	title: string;
	description: string;
	file_id: string;
}
export interface node {
	title: string;
	description: string;
	weight: number;
	assets: number[]; // asset_ids
	prerequisites: string[];
	parent: string | null;
	id: string;
}
export interface user {
	username: string;
	password: string;
	active_roadmap?: number;
	active_roadmap_collection?: number;
}
