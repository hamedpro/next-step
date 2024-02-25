import Graphviz from "graphviz-react";
import { steps_to_dot } from "../../helpers";
import { node } from "../../types";
import { useWindowSize } from "@uidotdev/usehooks";
import { gql, useQuery } from "@apollo/client";
import { useCollection } from "../useCollection";
import { useMemo } from "react";
export const UniversalMap = () => {
	var { data: nodes } = useCollection<node>("nodes");

	var { width, height } = useWindowSize();

	var dot = useMemo(() => steps_to_dot(nodes || []), [JSON.stringify(nodes)]);
	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				/* backgroundColor: "white", */
				overflow: "hidden",
			}}
			className="bg-neutral-900"
		>
			<Graphviz
				dot={dot}
				className="w-full h-full"
				options={{
					useWorker: false,
					zoom: true,

					width: ((width || window.innerWidth) * 90) / 100,
				}}
			/>
		</div>
	);
};
