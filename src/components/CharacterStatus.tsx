import { Panel } from "primereact/panel";
import Plot from "react-plotly.js";
import { useCollection } from "../useCollection";
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
import { Radar } from "react-chartjs-2";
import { useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { range } from "../../helpers";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
function CustomHeatmap({
	current_parent_node,
	user_skillset,
	children,
}: {
	current_parent_node: node | undefined;
	user_skillset: user["skill_set"];
	children: node[];
}) {
	var dimension = 1;
	while (dimension ** 2 < children.length) {
		dimension++;
	}
	var zValues = [];
	for (const row_index of range(0, dimension)) {
		var row = [];
		for (const col_index of range(0, dimension)) {
			row.push(0);
		}
		zValues.push(row);
	}
	for (const child_index of range(0, children.length)) {
		const child = children[child_index];
		var row_index = Math.floor(child_index / dimension);
		var col_index = child_index % dimension;

		zValues[row_index][col_index] =
			user_skillset.find((skill) => skill[0] === child.id)?.[1] || 0;
	}
	zValues.reverse();
	//return JSON.stringify(zValues, undefined, 4);
	return (
		<>
			<h1>HeatMap</h1>
			<Plot
				data={[
					{
						z: zValues,
						type: "heatmap",
					},
				]}
				layout={{ width: 320, height: 320 }}
			/>
		</>
	);
}
function RadarChart({
	children,
	user_skillset,
}: {
	children: node[];
	user_skillset: user["skill_set"];
}) {
	return (
		<>
			<h1>Radar Chart</h1>
			<Radar
				data={{
					labels: children.map((node) => node.title),
					datasets: [
						{
							label: "Your skillset",
							data: children.map(
								(node) =>
									(user_skillset.find((skill) => skill[0] === node.id)?.[1] ||
										0) * 20
							),
							backgroundColor: "rgba(255, 99, 132, 0.2)",
							borderColor: "rgba(255, 99, 132, 1)",
							borderWidth: 1,
						},
					],
				}}
			/>
		</>
	);
}
export const CharacterStatus = () => {
	var [current_parent_id, set_current_parent_id] = useState<node["parent"]>(null);
	var { data: nodes } = useCollection<node>("nodes");
	var { data: users } = useCollection<user>("users");
	if (nodes === undefined) return "i dont have nodes yet :(";
	var current_parent_node = nodes?.find((node) => node.id === current_parent_id);
	if (current_parent_id !== null && current_parent_id === undefined)
		return "current_parent_id is not null but i could not find the node in loaded nodes";
	if (users === undefined) return "users collection is not loaded yet";
	var user = users?.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined)
		return "users collection is loaded but there is no user with id = id you have in your localStorage (if you have !)";
	var children: node[] = nodes.filter((node) => node.parent === current_parent_id);
	return (
		<div style={{ display: "flex", columnGap: "30px" }}>
			<div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
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
					<Button
						style={{ marginBottom: "10px" }}
						key={node.id}
						onClick={() => {
							set_current_parent_id(node.id);
						}}
					>
						{node.title}
					</Button>
				))}
			</div>
			<div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
				<CustomHeatmap
					user_skillset={user.skill_set}
					current_parent_node={current_parent_node}
					children={children}
				/>
				<RadarChart
					user_skillset={user.skill_set}
					children={children}
				/>
			</div>
		</div>
	);
};
