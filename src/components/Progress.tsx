import React, { useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { CustomMenu, useCharacterStatus } from "./CharacterStatus";
export const Progress = () => {
	var possible_view_modes = ["heatmaps", "radar_charts"];

	var [view_mode, set_view_mode] = useState<"heatmaps" | "radar_charts">("heatmaps");
	var character_status = useCharacterStatus();
	if (typeof character_status === "string") return character_status;
	var { children, set_current_parent_id, current_parent_node, user } = character_status;
	return (
		<>
			<div style={{ display: "flex", justifyContent: "center" }}>
				<SelectButton
					options={possible_view_modes}
					onChange={(e) => set_view_mode(e.value)}
					value={view_mode}
				/>
			</div>
			<CustomMenu {...character_status} />
		</>
	);
};
