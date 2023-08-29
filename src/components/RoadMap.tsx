import { Graphviz } from "graphviz-react";
export const RoadMap = () => {
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
