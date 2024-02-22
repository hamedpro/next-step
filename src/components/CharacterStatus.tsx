import { Panel } from "primereact/panel"
import Plot from "react-plotly.js"
import { useCollection } from "../useCollection"
import { node } from "../../types"
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js"
import { Radar } from "react-chartjs-2"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)
export const CharacterStatus = () => {
	var { data: nodes } = useCollection<node>("nodes")
	if (nodes === undefined) return "i dont have nodes yet :("

	return (
		<>
			<div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
				<h1>HeatMap</h1>
				<Plot
					data={[
						{
							z: [
								[1, 20, 30],
								[20, 1, 60],
								[30, 60, 1],
							],
							type: "heatmap",
						},
					]}
					layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
				/>
				<h1>Radar Chart</h1>
				<Radar
					data={{
						labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
						datasets: [
							{
								label: "# of Votes",
								data: [2, 9, 3, 5, 2, 3],
								backgroundColor: "rgba(255, 99, 132, 0.2)",
								borderColor: "rgba(255, 99, 132, 1)",
								borderWidth: 1,
							},
						],
					}}
				/>
			</div>
			<div style={{ display: "flex", width: "50%", flexDirection: "column" }}></div>
		</>
	)
}
