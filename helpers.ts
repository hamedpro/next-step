import { store_standard_type } from "react_stream/dist/utils";
import { roadmap, step } from "./types";
export function steps_to_dot(steps_data: [number, "step", step][]) {
	var formatted_data: { [key: string]: string[] } = {};
	steps_data.forEach(([step_id, type, step]) => {
		step.prerequisites.forEach((prereq) => {
			if (formatted_data[prereq] === undefined) {
				formatted_data[prereq] = [];
			}
			formatted_data[prereq].push(step_id.toString());
		});
	});
	var nodes = shuffle(
		steps_data.map(
			([step_id, type, step]) =>
				`"${step_id}" [id="step-${step_id}",label="${step.title}",shape=box]`
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
	data: store_standard_type,
	roadmap_data: [number, "roadmap", roadmap]
): string {
	var steps = data.filter(
		([id, type, value]) => type === "step" && value.roadmap_id === roadmap_data[0]
	) as [number, "step", step][];
	return steps_to_dot(steps);
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
