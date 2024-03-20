import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export function LineChartWithAreaFill({ data }: { data: number[] }) {
	const options = {
		maintainAspectRatio: false,
		aspectRatio: 0.6,
	};
	return (
		<Chart
			style={{ height: "250px", width: "100%" }}
			type="line"
			data={{
				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [
					{
						label: "Exam records",
						data,
						fill: true,
						borderColor: "darkblue",
						tension: 0.4,
						backgroundColor: "blue",
					},
				],
			}}
			options={options}
		/>
	);
}
