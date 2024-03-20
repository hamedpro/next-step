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
import { BlurWallpaper } from "./BlurWallpaper";
import wallpaper from "/Users/hamedpro/wallpapers/blue_abstract_4.jpg";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export const Nodes = () => {
	var status = useCharacterStatus();
	if (typeof status === "string") return status;
	var { children, set_current_parent_id, current_parent_node, user } = status;
	return (
		<>
			<BlurWallpaper wallpaper={wallpaper} />
			<div style={{ padding: "0px 32px", color: "var(--color1_secondary)" }}>
				<CustomMenu
					children={children}
					set_current_parent_id={set_current_parent_id}
					current_parent_node={current_parent_node}
				/>
			</div>
		</>
	);
};
