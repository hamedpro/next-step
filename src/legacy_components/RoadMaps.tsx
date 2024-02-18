import { useContext } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { CustomTitle } from "../components/CustomTitle";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { roadmap } from "../../types";
export const RoadMaps = () => {
	var nav = useNavigate();
	var { data } = useContext(ServerSyncContext);

	return (
		<div style={{ padding: "12px" }}>
			<CustomTitle
				back_link="/"
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
					{data.filter(([id, type, value]) => type === "roadmap").length} Items
				</div>
			</CustomTitle>
			<hr />
			<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "25px" }}>
				{data
					.filter(([id, type, value]) => type === "roadmap")
					.map(([id, type, roadmap]) => (
						<Button
							style={{ minWidth: "60px" }}
							key={id}
							onClick={() => {
								nav(`/${id}`);
							}}
						>
							{roadmap.title}
						</Button>
					))}
			</div>
		</div>
	);
};
