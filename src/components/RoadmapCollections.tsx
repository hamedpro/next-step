import { Button } from "primereact/button";
import { CustomTitle } from "./CustomTitle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { context } from "freeflow-react";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { roadmap_collection_thing } from "../../types";
import { CustomCard } from "./CustomCard";
import { CustomPanel } from "./CustomPanel";

export const RoadmapCollections = () => {
	var { cache } = useContext(context);
	var roadmap_collections = cache.filter(
		(ci) => ci.thing.type === "roadmap_collection"
	) as cache_item<roadmap_collection_thing>[];
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
				{roadmap_collections.map((coll) => (
					<CustomPanel
						key={coll.thing_id}
						panel_title={`roadmap #${coll.thing_id}`}
						bootstrap_icon="bi-signpost-2"
						icon_title={coll.thing.value.title}
					>
						<div
							style={{
								padding: "8px 0px",
								display: "flex",
								flexDirection: "column",
								rowGap: "12px",
							}}
						>
							{coll.thing.value.description}
							<Button
								style={{ width: "fit-content" }}
								onClick={() => nav(`/${coll.thing_id}`)}
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
