import { useContext, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { roadmap_collection } from "../types";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { useNavigate } from "react-router-dom";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";

export const NewRoadmapCollection = () => {
	var nav = useNavigate();
	var { data, server_post_verb } = useContext(ServerSyncContext);
	var [new_roadmap_collection, set_new_roadmap_collection] = useState<roadmap_collection>({
		title: "",
		description: "",
		roadmaps: [],
	});

	async function submit_new_roadmap_collection() {
		var ref = { thing_id: undefined as number | undefined };
		server_post_verb((prev, max_existing_id) => {
			ref.thing_id = max_existing_id + 1;
			prev.push([max_existing_id + 1, "roadmap_collection", new_roadmap_collection]);
		});
		alert("was added successfully. you will be navigated to it.");
		nav(`/${ref.thing_id}`);
	}
	var existing_roadmaps = data.filter(([id, type, value]) => type === "roadmap");

	return (
		<div style={{ padding: "8px", display: "flex", flexDirection: "column", rowGap: "15px" }}>
			<CustomTitle
				back_link="/roadmap_collections"
				text="New Roadmap Collection"
			/>
			<label>Title:</label>
			<InputText
				value={new_roadmap_collection.title}
				onChange={(e) =>
					set_new_roadmap_collection((prev) => ({ ...prev, title: e.target.value }))
				}
			/>

			<label>Description:</label>
			<InputTextarea
				value={new_roadmap_collection.description}
				onChange={(e) =>
					set_new_roadmap_collection((prev) => ({ ...prev, description: e.target.value }))
				}
			/>
			<label>Roadmaps Of This Collection:</label>
			<MultiSelect
				options={existing_roadmaps.map(([id, type, roadmap]) => ({
					title: roadmap.title,
					code: id,
				}))}
				value={new_roadmap_collection["roadmaps"].map(({ id }) => ({
					title: existing_roadmaps.find(([id2, type, roadmap]) => id2 === id)?.[2].title,
					code: id,
				}))}
				onChange={(e) =>
					set_new_roadmap_collection((prev) => ({
						...prev,
						roadmaps: e.value.map(
							({ code, title }: { code: number; title: string }) => ({ id: code })
						),
					}))
				}
				optionLabel="title"
				style={{ color: "black" }}
			/>
			<Button
				icon="bi bi-check-fill"
				onClick={submit_new_roadmap_collection}
			>
				Submit
			</Button>
		</div>
	);
};
