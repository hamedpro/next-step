import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { roadmap, roadmap_collection, step, user } from "../../types";
import { Step } from "./Step";
import { RoadMap } from "./RoadMap";
import { RoadmapCollection } from "./RoadmapCollection";
import { UserProfile } from "./UserProfile";
export const ThingRoute = () => {
	var { data } = useContext(ServerSyncContext);

	var { thing_id } = useParams();
	if (!thing_id || isNaN(Number(thing_id))) return "invalid thing id. check url again.";
	var pointer = data.find(([id, type, value]) => {
		return id === Number(thing_id);
	});
	if (pointer === undefined) {
		return `404 - there is no thing with id = ${thing_id}`;
	} else {
		switch (pointer[1]) {
			case "roadmap":
				return <RoadMap roadmap_data={pointer as [number, "roadmap", roadmap]} />;
			case "step":
				return <Step step_data={pointer as [number, "step", step]} />;
			case "roadmap_collection":
				return (
					<RoadmapCollection
						roadmap_collection_data={
							pointer as [number, "roadmap_collection", roadmap_collection]
						}
					/>
				);
			case "user":
				return <UserProfile user={pointer[2] as user} />;
			default:
				return `could find the data but type ${pointer[1]} is not supported yet.`;
		}
	}
};
