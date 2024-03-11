import Plot from "react-plotly.js";
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
import { range } from "../../helpers";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
export function CustomHeatmap({
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
