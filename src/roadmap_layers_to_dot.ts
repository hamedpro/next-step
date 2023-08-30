import jsonToDot from "json-to-dot";
import { roadmap } from "../types";
export function roadmap_layers_to_dot(layers: roadmap["layers"]): string {
	var formatted_data: { [key: string]: string[] } = {};
	layers
		.flat()

		.forEach((node) => {
			if (node.points_to !== undefined) {
				formatted_data[node.id.toString()] = node.points_to.map((id) => id.toString());
			}
		});
	//console.log(layers.flat());
	return jsonToDot(formatted_data);
}
