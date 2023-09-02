import { thing_base } from "freeflow-core/dist/UnifiedHandler_types";

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
	resources: resource[];
	laboratory: laboratory;
};
export type roadmap = {
	layers: layer[];
	title: string;
	description: string;
};
export type store = {
	roadmaps: roadmap[];
};
export interface roadmap_thing extends thing_base {
	type: "roadmap";
	value: roadmap;
}
