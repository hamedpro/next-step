import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export function LineChartWithAreaFill({ data, labels }: { data: number[]; labels?: string[] }) {
	const options = {
		maintainAspectRatio: false,
		aspectRatio: 0.6,
	};
	var a = [];
	for (var i = 0; i < data.length; i++) {
		a.push(i + 1);
	}
	return (
		<Chart
			style={{ height: "250px", width: "100%" }}
			type="line"
			data={{
				labels: labels || a,
				datasets: [
					{
						label: "Exam Records",
						data: data,
						fill: true,
						tension: 0.4,
						backgroundColor: "blue",
						borderColor: "green",
					},
				],
			}}
			options={options}
		/>
	);
}
