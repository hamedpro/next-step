import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import { Panel } from "primereact/panel";
import { useContext } from "react";
import { roadmap_thing } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { CustomTitle } from "./CustomTitle";
export const RoadMaps = () => {
	var { cache } = useContext(context);
	var roadmaps: cache_item<any>[] = cache.filter((ci) => ci.thing.type === "roadmap");
	var nav = useNavigate();
	return (
		<>
			<CustomTitle
				back_link=""
				text="RoadMaps"
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "row-reverse",
						width: "100%",
						padding: "0px 20px",
					}}
				>
					{roadmaps.length} Items
				</div>
			</CustomTitle>
			<hr />
			<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "25px" }}>
				{roadmaps.map((ci) => (
					<Button
						style={{ minWidth: "60px" }}
						key={ci.thing_id}
						onClick={() => {
							nav(`/${ci.thing_id}`);
						}}
					>
						{ci.thing.value.title}
					</Button>
				))}
			</div>
		</>
	);
};
