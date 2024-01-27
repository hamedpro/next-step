import { useContext } from "react";
import { context } from "freeflow-react";
import { useParams } from "react-router-dom";
import { cache, cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { RoadMap } from "./RoadMap";
import { app_thing, roadmap_collection_thing, roadmap_thing, step_thing } from "../types";
import { Step } from "./Step";
import { RoadmapCollection } from "./RoadmapCollection";
export const ThingRoute = () => {
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
		} else if (cache_item.thing.type === "roadmap_collection") {
			return (
				<RoadmapCollection
					roadmap_collection={cache_item as cache_item<roadmap_collection_thing>}
				/>
			);
		}
	}
};
