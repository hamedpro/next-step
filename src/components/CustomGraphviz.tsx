import Graphviz from "graphviz-react";
import { steps_to_dot } from "../../helpers";
import { node } from "../../types";
import { useWindowSize } from "@uidotdev/usehooks";
import { gql, useQuery } from "@apollo/client";
import { useCollection } from "../useCollection";
import { useMemo } from "react";
export const CustomGraphviz = ({
	width_vw,
	height_vh,
	included_nodes,
}: {
	width_vw: number;
	height_vh: number;
	included_nodes: node[];
}) => {
	var { width, height } = useWindowSize() as { width: number; height: number };

	var dot = useMemo(() => steps_to_dot(included_nodes), [JSON.stringify(included_nodes)]);
	return (
		<Graphviz
			dot={dot}
			options={{
				useWorker: false,
				zoom: true,
				width: (width * width_vw) / 100,
				height: (height * height_vh) / 100,
			}}
		/>
	);
};
