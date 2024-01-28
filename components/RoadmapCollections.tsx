import { Button } from "primereact/button";
import { CustomTitle } from "./CustomTitle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CustomPanel } from "./CustomPanel";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { roadmap_collection } from "../types";

export const RoadmapCollections = () => {
	var { data } = useContext(ServerSyncContext);
	var roadmap_collections = data.filter(([id, type, value]) => type === "roadmap_collection") as [
		number,
		"roadmap_collection",
		roadmap_collection
	][];
	var nav = useNavigate();
	return (
		<div style={{ padding: "8px" }}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<CustomTitle
					back_link="/"
					text="Roadmap Collections"
				/>
				<Button
					style={{
						height: "fit-content",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
					icon="bi bi-plus pr-2"
					onClick={() => nav("/roadmap_collections/new")}
				>
					New
				</Button>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					rowGap: "12px",
					flexDirection: "column",
				}}
			>
				{roadmap_collections.map(([id, type, roadmap_collection]) => (
					<CustomPanel
						key={id}
						panel_title={`roadmap #${id}`}
						bootstrap_icon="bi-signpost-2"
						icon_title={roadmap_collection.title}
					>
						<div
							style={{
								padding: "8px 0px",
								display: "flex",
								flexDirection: "column",
								rowGap: "12px",
							}}
						>
							{roadmap_collection.description}
							<Button
								style={{ width: "fit-content" }}
								onClick={() => nav(`/${id}`)}
							>
								Jump In
							</Button>
						</div>
					</CustomPanel>
				))}
			</div>
		</div>
	);
};
