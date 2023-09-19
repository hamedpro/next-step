import { roadmap, roadmap_thing, step_thing } from "../types";
import { step } from "../types";
import { cache, cache_item, core_thing } from "freeflow-core/dist/UnifiedHandler_types";

export function roadmap_to_dot(
	cache: cache_item<core_thing | step_thing>[],
	roadmap_ci: cache_item<roadmap_thing>
): string {
	var formatted_data: { [key: string]: string[] } = {};
	var steps = cache.filter(
		(ci) => ci.thing.type === "step" && ci.thing.value.roadmap_id === roadmap_ci.thing_id
	);
	steps.forEach((step) => {
		if ("connects_to" in step.thing.value && step.thing.value.connects_to !== undefined) {
			formatted_data[step.thing_id.toString()] = step.thing.value.connects_to.map(
				(id: number) => id.toString()
			);
		}
	});
	var tmp = `
	digraph G {
		${steps
			.map(
				(step) =>
					`"${step.thing_id}" [id="step-${step.thing_id}",label="${step.thing.value.title}",shape=box]`
			)
			.join("\n")}
		${Object.keys(formatted_data)
			.map((from: string) =>
				formatted_data[from]
					.map((to) => `"${from}" -> "${to}" [id="${from}-${to}"]`)
					.join("\n")
			)
			.join("\n")}
	}
	`;
	return tmp;
}
export const jsonToDot = (json: string) => {
	//this function is copied from https://github.com/Risto-Stevcev/json-to-dot
	//the repo was licensed under MIT
	var parsed: { [key: string]: string[] } = JSON.parse(json);
	return (
		Object.entries(parsed).reduce((acc, [node, dependencies]) => {
			return dependencies.reduce(
				(acc, dependency) => acc + `  "${node}" -> "${dependency}"\n`,
				acc
			);
		}, "digraph G {\n") + "}"
	);
};
export function shuffle(array: any[]) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}
