import { Graphviz } from "graphviz-react";
import { roadmap_layers_to_dot } from "../roadmap_layers_to_dot";
import { useContext } from "react";
import { context } from "freeflow-react";
import { useNavigate, useParams } from "react-router-dom";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
export const RoadMap = () => {
	var nav = useNavigate();
	var freeflow_context = useContext(context);

	var { roadmap_id } = useParams();
	if (!roadmap_id || isNaN(Number(roadmap_id))) return "invalid RoadMap id. check url again.";
	var roadmap: cache_item<any> | undefined = freeflow_context.cache.find((ci) => {
		return ci.thing_id === Number(roadmap_id);
	});

	if (roadmap === undefined) return `404 - there is no RoadMap with id = ${roadmap_id}`;

	var dot = roadmap_layers_to_dot(roadmap.thing.value.layers);

	return (
		<div style={{ padding: "4px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h1>RoadMap</h1>
				<Button
					size="small"
					style={{ height: "fit-content", padding: "8px 12px" }}
					onClick={() => nav(`/roadmaps/${roadmap_id}/edit`)}
				>
					<i
						className="bi bi-pencil"
						style={{ marginRight: "4px" }}
					/>{" "}
					Edit
				</Button>
			</div>
			<p style={{ margin: "4px 0px 4px 0px" }}>
				<span>Title: </span>
				<b style={{ marginBottom: "0px" }}>{roadmap.thing.value.title}</b>
			</p>

			<p style={{ margin: "4px 0px 4px 0px" }}>
				<span>Description: </span>
				<b>{roadmap.thing.value.description}</b>
			</p>

			{roadmap.thing.value.layers.length === 0 ? (
				<Message text="this roadmap has not any layers yet" />
			) : (
				<Graphviz
					dot={dot}
					options={{ useWorker: false }}
				/>
			)}
		</div>
	);
};
