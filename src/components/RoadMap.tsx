import { Graphviz } from "graphviz-react";
import { roadmap_layers_to_dot } from "../roadmap_layers_to_dot";
import create_fake_roadmap_layers from "../create_fake_roadmap_layers";
import { useContext, useEffect } from "react";
import { context } from "freeflow-react";
import { useParams } from "react-router-dom";
import { cache_item, thing } from "freeflow-core/dist/UnifiedHandler_types";
export const RoadMap = () => {
	var freeflow_context = useContext(context);

	var { roadmap_id } = useParams();
	if (!roadmap_id || isNaN(Number(roadmap_id))) return "invalid RoadMap id. check url again.";
	var roadmap: cache_item<any> | undefined = freeflow_context.cache.find((ci) => {
		return ci.thing_id === Number(roadmap_id);
	});
	if (roadmap === undefined) return `404 - there is no RoadMap with id = ${roadmap_id}`;

	var dot = roadmap_layers_to_dot(roadmap.thing.value.layers);
	return (
		<div>
			<h1>RoadMap</h1>
			<Graphviz
				dot={dot}
				options={{ useWorker: false }}
			/>
		</div>
	);
};
