import React, { useState } from "react";
import { layer, roadmap_thing } from "../../types";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { Button } from "primereact/button";
import { NewStepModal } from "./NewStepModal";

export const RoadMapLayerEditor = ({
	layer,
	roadmap,
}: {
	layer: layer;
	roadmap: cache_item<roadmap_thing>;
}) => {
	var modal_visibility = useState(false);
	return (
		<>
			<NewStepModal
				state={modal_visibility}
				roadmap={roadmap}
			/>
			<div
				style={{
					backgroundColor: "white",
					width: "100%",
					minHeight: "50px",
					margin: "12px 0px",
					borderRadius: "4px",
					display: "flex",
					padding: "8px",
					alignItems: "center",
				}}
				className="shadow"
			>
				{layer.map((step) => (
					<Button>{step.title}</Button>
				))}
				<Button onClick={() => modal_visibility[1](true)}>
					<i className="bi bi-plus" />
				</Button>
			</div>
		</>
	);
};
