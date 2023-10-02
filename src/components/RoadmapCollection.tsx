import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import React from "react";
import { roadmap_collection, roadmap_collection_thing } from "../../types";

export const RoadmapCollection = ({
	roadmap_collection,
}: {
	roadmap_collection: cache_item<roadmap_collection_thing>;
}) => {
	return <div>RoadmapCollection</div>;
};
