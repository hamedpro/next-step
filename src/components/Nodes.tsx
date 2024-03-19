import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { CustomMenu } from "./CustomMenu";
import { useCharacterStatus } from "../useCharacterStatus";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const Dashboard = () => {
	var status = useCharacterStatus();
	if (typeof status === "string") return status;
	var { children, set_current_parent_id, current_parent_node, user } = status;
	return (
		<CustomMenu
			children={children}
			set_current_parent_id={set_current_parent_id}
			current_parent_node={current_parent_node}
		/>
	);
};
