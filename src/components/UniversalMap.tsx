import Graphviz from "graphviz-react";
import { steps_to_dot } from "../../helpers";
import { node } from "../../types";
import { useWindowSize } from "@uidotdev/usehooks";
import { gql, useQuery } from "@apollo/client";
import { useCollection } from "../useCollection";
export const UniversalMap = () => {
	var { data: nodes } = useCollection<node>("nodes");

	var { width, height } = useWindowSize();

	if (nodes === undefined) return "data not available yet";
	var nodes_to_show: node[] = nodes;
	var dot = steps_to_dot(nodes_to_show);
	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				/* backgroundColor: "white", */
				position: "fixed",
			}}
			className="bg-neutral-900"
		>
			<Graphviz
				dot={dot}
				className="w-full h-full"
				options={{
					useWorker: false,
					zoom: true,
					height: height || window.innerHeight,
					width: width || window.innerWidth,
				}}
			/>
		</div>
	);
};
