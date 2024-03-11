import { node, user } from "../../types";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { Dispatch, SetStateAction } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useCollection } from "../useCollection";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function CustomMenu({
	current_parent_node,
	set_current_parent_id,
	children,
}: {
	current_parent_node: undefined | node;
	set_current_parent_id: Dispatch<SetStateAction<node["parent"]>>;
	children: node[];
}) {
	var nav = useNavigate();
	var { data: users } = useCollection<user>("users");
	if (users === undefined) return "users collection not available yet";
	var user = users.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "could not find your user data";
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<CustomTitle
				back_onclick={() => {
					if (current_parent_node === undefined) {
						alert("there is no parent to open");
						return;
					} else {
						set_current_parent_id(current_parent_node.parent);
					}
				}}
				text={current_parent_node?.title || "Root"}
			/>
			{children.map((node) => (
				<div
					style={{
						marginBottom: "10px",
						width: "50%",
						borderRadius: "12px",
						aspectRatio: "1",
						position: "relative",
						border: "1px solid white",
						padding: "10px",
						cursor: "pointer",
					}}
					key={node.id}
					onClick={() => {
						set_current_parent_id(node.id);
					}}
				>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							nav(`/nodes/${node.id}`);
						}}
						style={{
							position: "absolute",
							height: "30px",
							width: "30px",
							borderRadius: "100%",
							background: "blue",
							color: "white",
							top: "10px",
							right: "10px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<i className="bi bi-arrow-up-right-circle-fill" />
					</Button>
					<h1>{node.title}</h1>

					<p>{node.description}</p>
					<DataTable
						value={user!.exam_records.map((i, index) => {
							var tmp = { ...i, id: index };
							console.log(user!.exam_records);
							//console.log(tmp);
							return tmp;
						})}
					>
						<Column field="id" />
						<Column field="node_id" />
						<Column field="score" />
						<Column field="time" />
					</DataTable>
				</div>
			))}
		</div>
	);
}
