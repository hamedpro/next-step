import { node } from "../../types";
import { useCollection } from "../useCollection";
import { CustomGraphviz } from "./CustomGraphviz";

export function UniversalMap() {
	var { data: nodes } = useCollection<node>("nodes");
	if (nodes === undefined) return "loading";
	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				overflow: "hidden",
				justifyContent: "center",
				alignItems: "center",
				display: "flex",
			}}
			className="bg-neutral-900"
		>
			<CustomGraphviz
				width_vw={90}
				height_vh={90}
				included_nodes={nodes}
			/>
		</div>
	);
}
