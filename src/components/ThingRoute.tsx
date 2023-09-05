import { useContext } from "react";
import { context } from "freeflow-react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { RoadMap } from "./RoadMap";
import { app_thing, roadmap_thing, step, step_thing } from "../../types";
import { Step } from "./Step";
export const ThingRoute = () => {
	var nav = useNavigate();
	var { cache } = useContext(context);

	var { thing_id } = useParams();
	if (!thing_id || isNaN(Number(thing_id))) return "invalid thing id. check url again.";
	var cache_item: cache_item<app_thing> | undefined = cache.find((ci) => {
		return ci.thing_id === Number(thing_id);
	});
	if (cache_item === undefined) {
		return `404 - there is no thing with id = ${thing_id}`;
	} else {
		if (cache_item.thing.type === "roadmap") {
			return <RoadMap roadmap={cache_item as cache_item<roadmap_thing>} />;
		} else if (cache_item.thing.type === "step") {
			return <Step step={cache_item as cache_item<step_thing>} />;
		}
	}
};
