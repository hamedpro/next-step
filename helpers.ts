import { WithId } from "mongodb";
import { node } from "./types";
export function steps_to_dot(nodes: Pick<WithId<node>, "_id" | "title" | "prerequisites">[]) {
	//each node_id is mapped to all those nodes that depend on that
	var formatted_data: { [node_id: string]: string[] } = {};

	nodes.forEach((node) => {
		node.prerequisites.forEach((prereq_id) => {
			if (formatted_data[prereq_id] === undefined) {
				formatted_data[prereq_id] = [];
			}
			formatted_data[prereq_id].push(node._id);
		});
	});
	var graph_nodes = nodes.map(
		(node) => `"${node._id}" [id="step-${node._id}",label="${node.title}",shape=box]`
	);
	shuffle(graph_nodes);

	var nodes_part_1 = [];
	var nodes_part_2 = [];
	for (var i = 0; i < graph_nodes.length; i++) {
		if (Math.random() < 0.5) {
			nodes_part_1.push(graph_nodes[i]);
		} else {
			nodes_part_2.push(graph_nodes[i]);
		}
	}
	var graph_edges = Object.keys(formatted_data).map((from: string) =>
		formatted_data[from].map((to) => `"${from}" -> "${to}" [id="${from}-${to}"]`).join("\n")
	);

	return `
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
		
		${graph_edges.join("\n")}
	}
	`;
}
export function shuffle(array: any[]) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
