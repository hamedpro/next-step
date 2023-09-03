import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import { Panel } from "primereact/panel";
import { useContext } from "react";
import { roadmap_thing } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
export const RoadMaps = () => {
	var { cache } = useContext(context);
	var roadmaps: cache_item<any>[] = cache.filter((ci) => ci.thing.type === "roadmap");
	var nav = useNavigate();
	return (
		<>
			<h1>RoadMaps</h1>
			<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
				{roadmaps.map((ci) => (
					<Button
						style={{ minWidth: "60px" }}
						key={ci.thing_id}
						onClick={() => {
							nav(`/roadmaps/${ci.thing_id}`);
						}}
					>
						{ci.thing.value.title}
					</Button>
				))}
			</div>
		</>
	);
};
