import { Graphviz } from "graphviz-react";
import { useContext } from "react";
import { context } from "freeflow-react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { roadmap_to_dot } from "../helpers";
import { RoadMap } from "./RoadMap";
export const RoadMapRoute = () => {
	var nav = useNavigate();
	var { cache } = useContext(context);

	var { roadmap_id } = useParams();
	if (!roadmap_id || isNaN(Number(roadmap_id))) return "invalid RoadMap id. check url again.";
	var roadmap: cache_item<any> | undefined = cache.find((ci) => {
		return ci.thing_id === Number(roadmap_id);
	});
	if (roadmap === undefined) return `404 - there is no RoadMap with id = ${roadmap_id}`;
	return (
		<Routes>
			<Route
				path=""
				element={<RoadMap roadmap={roadmap} />}
			/>
		</Routes>
	);
};
