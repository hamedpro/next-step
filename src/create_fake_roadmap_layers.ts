import { layer, roadmap, step } from "../types";
export default function (layers_count = 15) {
	function randomInRange(start: number, end: number) {
		//was copied from SOF
		return Math.floor(Math.random() * (end - start + 1) + start);
	}
	var roadmap: roadmap = {
		title: "something",
		description: "how to learn something",
		layers: [],
	};
	var layers: layer[] = [];
	var id = 0;
	for (var layer_index = 0; layer_index < layers_count; layer_index++) {
		var layer_nodes_count = randomInRange(1, 5);
		//console.count("new_layer");
		var layer: step[] = [];
		for (var node_index = 0; node_index < layer_nodes_count; node_index++) {
			layer.push({
				title: `layer${layer_index}-${node_index}`,
				description: "this is a description",
				resources: [],
				laboratory: null,
				weight: 2,
				id,
			});
			id++;
		}
		layers.push(layer);
	}

	//connecting layers together
	for (var layer_index = 0; layer_index < layers_count; layer_index++) {
		//last layer has not any layer after itself to point to
		if (layer_index === layers_count - 1) break;

		var next_layer_index = layer_index + 1;
		layers[layer_index].forEach((node) => {
			node.points_to = layers[next_layer_index].map((node) => node.id);
		});
	}
	return layers;
}
