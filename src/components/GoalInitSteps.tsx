import React from "react";

import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { useLocation, useNavigate } from "react-router-dom";
export const GoalInitSteps = () => {
	var loc = useLocation();
	var nav = useNavigate();
	var options = [
		["Goal Choosing", "/goal/choosing"],
		["Goal Timing Setting", "/goal/timing"],
		["Goal Status", "/goal"],
	];
	const items: MenuItem[] = options.map(
		(item) =>
			({
				label: item[0],
				command: (event: any) => {
					nav(item[1]);
				},
			} as MenuItem)
	);

	return (
		<Steps
			model={items}
			activeIndex={options.map((opt) => opt[1]).indexOf(loc.pathname)}
			readOnly={false}
		/>
	);
};
