import { WithId } from "mongodb";
import { node, user } from "./types";
import { SHA256 } from "crypto-js";
import JsFileDownloader from "js-file-downloader";
import { api_endpoint } from "./src/useCollection";
export function steps_to_dot(nodes: node[]) {
	//each node_id is mapped to all those nodes that depend on that
	var formatted_data: { [node_id: string]: string[] } = {};

	nodes.forEach((node) => {
		if (!("prerequisites" in node)) {
			console.error("prerequisites N/A for", node);
			throw new Error();
		}
		node.prerequisites.forEach((prereq_id) => {
			if (formatted_data[prereq_id] === undefined) {
				formatted_data[prereq_id] = [];
			}
			formatted_data[prereq_id].push(node.id);
		});
	});
	var graph_nodes = nodes.map(
		(node) => `"${node.id}" [id="step-${node.id}",label="${node.title}",shape=box]`
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
export function custom_sha256_hash(input: any): string {
	var inputString: string;
	try {
		inputString = JSON.stringify(input);
	} catch (error) {
		throw new Error("Unable to stringify input");
	}
	const hash = SHA256(inputString).toString();
	return hash;
}
export function download_a_file(file_id: number) {
	new JsFileDownloader({
		url: new URL(`/files/${file_id}`, api_endpoint).href,
		headers: [],
		method: "GET",
		contentType: "application/json",
	});
}

/**
 * just like python3 range func :
 * start is inclusive but stop is exclusive
 * */
export function range(start: number, stop: number) {
	const numbers: number[] = [];
	for (let i = start; i < stop; i++) {
		numbers.push(i);
	}
	return numbers;
}
export const sum = (array: number[]) => array.reduce((a, b) => a + b, 0);
export const avg = (array: number[]) => sum(array) / array.length;

export function calc_user_skill_level(user: user, node_id: string) {
	var related_exam_records = user.exam_records.filter((rec) => rec.node_id === node_id);
	if (related_exam_records.length === 0) return 0;

	return Math.round(avg(related_exam_records.map((rec) => rec.score)) / 5);
}
export function getTimestampsForNDays(n: number): number[] {
	const timestamps: number[] = [];
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set time to the start of the day

	for (let i = 0; i < n; i++) {
		const nextDay = new Date(today);
		nextDay.setDate(nextDay.getDate() + i);
		timestamps.push(nextDay.getTime());
	}

	return timestamps;
}
export function insertSpaces(str: string, n: number): string {
	// Handle empty string or n <= 0 cases
	if (str.length === 0 || n <= 0) {
		return str;
	}

	const result = [];
	for (let i = 0; i < str.length; i += n) {
		result.push(str.slice(i, Math.min(i + n, str.length)));
	}

	return result.join(" ");
}

export function insertSpacesAtIndices(text: string, indices: number[]): string {
	// Handle empty text or invalid indices
	if (!text || !indices || !indices.length) {
		return text;
	}

	const sortedIndices = indices.sort((a, b) => a - b); // Remove duplicates and sort indices
	const result: string[] = [];
	let start = 0;

	for (const index of sortedIndices) {
		// Ensure index is within the text's length
		if (index < 0 || index >= text.length) {
			continue;
		}

		result.push(text.slice(start, index));
		result.push(" ");
		start = index;
	}

	// Append the remaining part of the text
	result.push(text.slice(start));

	return result.join("");
}
export function generateRandomString(length: number, not_allowed?: string[]): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var output = Array.from(
		{ length },
		() => characters[Math.floor(Math.random() * characters.length)]
	).join("");
	if (not_allowed !== undefined && not_allowed.includes(output)) {
		return generateRandomString(length, not_allowed);
	} else {
		return output;
	}
}
export function generate_random_string_only_numbers(n: number): string {
	// Character pool containing only digits
	const charPool = "0123456789";

	// Use Math.random() to generate random indexes within the character pool
	var randomString = "";
	for (let i = 0; i < n; i++) {
		const randomIndex = Math.floor(Math.random() * charPool.length);
		randomString += charPool.charAt(randomIndex);
	}

	return randomString;
}
