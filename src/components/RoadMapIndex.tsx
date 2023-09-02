import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import React, { useContext } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { EditRoadMap } from "./EditRoadMap";
import { RoadMap } from "./RoadMap";

export const RoadMapIndex = () => {
	var nav = useNavigate();
	var freeflow_context = useContext(context);

	var { roadmap_id } = useParams();
	if (!roadmap_id || isNaN(Number(roadmap_id))) return "invalid RoadMap id. check url again.";
	var roadmap: cache_item<any> | undefined = freeflow_context.cache.find((ci) => {
		return ci.thing_id === Number(roadmap_id);
	});

	if (roadmap === undefined) return `404 - there is no RoadMap with id = ${roadmap_id}`;
	return (
		<Routes>
			<Route
				path="edit"
				element={<EditRoadMap roadmap={roadmap} />}
			/>
			<Route
				path=""
				element={<RoadMap />}
			/>
		</Routes>
	);
};
