import { core_thing, thing_base } from "freeflow-core/dist/UnifiedHandler_types";
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
	connects_to: number[];
	roadmap_id: number;
};
export type roadmap = {
	title: string;
	description: string;
};
export interface roadmap_thing extends thing_base {
	type: "roadmap";
	value: roadmap;
}
export interface step_thing extends thing_base {
	type: "step";
	value: step;
}
export interface lab_thing extends thing_base {
	type: "lab";
	value: lab;
}
export type app_thing = core_thing | roadmap_thing | step_thing;
