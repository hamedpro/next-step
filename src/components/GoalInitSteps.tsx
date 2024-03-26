import React from "react";

import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

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
		<Box sx={{ width: "100%", margin: "32px 0px" }}>
			<Stepper
				activeStep={options.findIndex((i) => loc.pathname === i[1])}
				alternativeLabel
			>
				{options.map((option) => (
					<Step key={option[1]}>
						<StepLabel>{option[0]}</StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
};
