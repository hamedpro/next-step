import { roadmap_thing, step_thing } from "./types";
import { cache_item, core_thing } from "freeflow-core/dist/UnifiedHandler_types";
export function steps_to_dot(steps: cache_item<step_thing>[]) {
	var formatted_data: { [key: string]: string[] } = {};
	steps.forEach((step) => {
		if ("prerequisites" in step.thing.value && step.thing.value.prerequisites !== undefined) {
			(step.thing.value.prerequisites as Array<number>).forEach((prereq) => {
				if (formatted_data[prereq] === undefined) {
					formatted_data[prereq] = [];
				}
				formatted_data[prereq].push(step.thing_id.toString());
			});
		}
	});
	var nodes = shuffle(
		steps.map(
			(step) =>
				`"${step.thing_id}" [id="step-${step.thing_id}",label="${step.thing.value.title}",shape=box]`
		)
	);

	var nodes_part_1 = [];
	var nodes_part_2 = [];
	for (var i = 0; i < nodes.length; i++) {
		if (Math.random() < 0.5) {
			nodes_part_1.push(nodes[i]);
		} else {
			nodes_part_2.push(nodes[i]);
		}
	}
	var edges = Object.keys(formatted_data).map((from: string) =>
		formatted_data[from].map((to) => `"${from}" -> "${to}" [id="${from}-${to}"]`).join("\n")
	);

	var tmp = `
	digraph G {
		rankdir="TB";
		splines=true;
		overlap=false;
		nodesep="0.2";
		ranksep="0.4";
		labelloc="t";
		fontname="Lato";
		node [ shape="plaintext" style="filled, rounded" fontname="Lato" margin=0.2 width=5];
		edge [ fontname="Lato" color="#2B303A" ];
		node [ color="#ED96AC" ];
		nodesep=1.5;
		${nodes_part_1.join("\n")}
		node [ color="#ABD2FA" ]
		nodesep=1.5;
		${nodes_part_2.join("\n")}
		
		${edges.join("\n")}
	}
	`;
	return tmp;
}
export function roadmap_to_dot(
	cache: cache_item<core_thing | step_thing>[],
	roadmap_ci: cache_item<roadmap_thing>
): string {
	var steps = cache.filter(
		(ci) => ci.thing.type === "step" && ci.thing.value.roadmap_id === roadmap_ci.thing_id
	);
	return steps_to_dot(steps as cache_item<step_thing>[]);
}
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
