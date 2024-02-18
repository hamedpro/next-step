import Graphviz from "graphviz-react";
import { steps_to_dot } from "../../helpers";
import { node } from "../../types";
import { useWindowSize } from "@uidotdev/usehooks";
import { gql, useQuery } from "@apollo/client";
export const UniversalMap = () => {
	var { data, loading } = useQuery(gql`
		query get_nodes {
			nodes {
				title
				prerequisites
				_id
			}
		}
	`);

	var { width, height } = useWindowSize();
	if (loading === true) {
		return "loading...";
	}

	var nodes_to_show: Pick<node, "_id" | "prerequisites" | "title">[] = data.nodes;
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
