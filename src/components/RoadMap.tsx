import { useState } from "react";
import { useParams } from "react-router-dom";
import { roadmap } from "../../types";
import { Graphviz } from "graphviz-react";
export const RoadMap = () => {
	var { roadmap_id } = useParams();
	if (!roadmap_id || isNaN(Number(roadmap_id))) return "invalid roadmap id";
	var [roadmap, set_roadmap] = useState<roadmap | undefined>();
	if (roadmap === undefined) return "still loading";

	return (
		<div>
			<h1>RoadMap</h1>
			<Graphviz
				dot={`graph {
  grandparent -- "parent A";
  child;
  "parent B" -- child;
  grandparent --  "parent B";
}`}
			/>
		</div>
	);
};
