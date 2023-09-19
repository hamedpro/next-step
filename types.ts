import { core_thing, thing_base } from "freeflow-core/dist/UnifiedHandler_types";

export type resource = {
	title: string;
	link: string;
	premium_only?: boolean;
};
export type step = {
	title: string;
	description: string;
	weight: number;
	resources: resource[];
	laboratory: any;
	connects_to: number[];
	roadmap_id: number;
};
export type roadmap = {
	title: string;
	description: string;
};
export type premium_subscription = {
	user_id: number;
	start_timestamp: number;
	end_timestamp: number;
};
export interface premium_subscription_thing extends thing_base {
	type: "premium_subscription";
	value: premium_subscription;
}
export interface roadmap_thing extends thing_base {
	type: "roadmap";
	value: roadmap;
}
export interface step_thing extends thing_base {
	type: "step";
	value: step;
}
export type app_thing = core_thing | roadmap_thing | step_thing;
