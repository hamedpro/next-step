import Plot from "react-plotly.js";
import { custom_axios, useCollection } from "../useCollection";
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
import { Dispatch, SetStateAction, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { range } from "../../helpers";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useRecording } from "../useRecording";
import { CustomHeatmap } from "./CustomHeatmap";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function RadarChart({
	children,
	user_skillset,
}: {
	children: node[];
	user_skillset: user["skill_set"];
}) {
	return (
		<>
			<h1>Radar Chart</h1>
			<div style={{ backgroundColor: "aqua" }}>
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
								backgroundColor: "green",
								borderColor: "blue",
								borderWidth: 1,
							},
						],
					}}
				/>
			</div>
		</>
	);
}
