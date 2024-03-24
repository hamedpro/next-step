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
import { Link, useNavigate } from "react-router-dom";
import { useCollection } from "../useCollection";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { truncateWithEllipsis } from "../../helpers";
import { LineChartWithAreaFill } from "./LineChartWithAreaFill";
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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
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
				style={{ padding: "24px 0px" }}
			/>
			<div
				style={{
					flexWrap: "wrap",
					borderRadius: "8px",
					display: "flex",
					width: "100%",
					justifyContent: "space-between",
					rowGap: "12px",
					color: "var(--color1_primary)",
				}}
			>
				{children.map((node) => (
					<div
						style={{
							marginBottom: "10px",
							width: "50%",
							borderRadius: "12px",
							aspectRatio: "1",
							position: "relative",
							background: "var(--color2_secondary)",
							padding: "16px",

							cursor: "pointer",
							...{
								flex: "0 0 calc(50% - 12px)",
								textAlign: "start",
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
							},
						}}
						key={node.id}
						onClick={() => {
							set_current_parent_id(node.id);
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
								alignItems: "center",
							}}
						>
							<h1 style={{ margin: "0px" }}>{node.title}</h1>

							<Button
								rounded
								text
								aria-label="Filter"
								onClick={(e) => {
									e.stopPropagation();
									nav(`/nodes/${node.id}`);
								}}
								style={{
									height: "40px",
									width: "40px",
									borderRadius: "100%",
									background: "lightblue",
									fontSize: "35px",

									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								icon="bi bi-arrow-up-right-circle-fill"
							/>
						</div>

						<p
							style={{
								margin: "24px 0px",
								overflowY: "scroll",
								textOverflow: "ellipsis",
							}}
						>
							{truncateWithEllipsis(node.description, 150)}
						</p>
						<LineChartWithAreaFill
							data={user!.exam_records
								.sort((e1, e2) => e1.time - e2.time)
								.map((i, index) => i.score)}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
