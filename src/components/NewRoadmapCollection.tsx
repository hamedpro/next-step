import { useContext, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { roadmap_collection } from "../../types";
import { profile_seed } from "freeflow-core/dist/UnifiedHandler_types";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { useNavigate } from "react-router-dom";

export const NewRoadmapCollection = () => {
	var nav = useNavigate();
	var { profiles_seed, cache, request_new_thing } = useContext(context);
	var [new_roadmap_collection, set_new_roadmap_collection] = useState<roadmap_collection>({
		title: "",
		description: "",
		roadmaps: [],
	});
	var active_prof_seed: profile_seed | undefined = find_active_profile_seed(profiles_seed);
	var is_admin = active_prof_seed?.user_id === -1;
	async function submit_new_roadmap_collection() {
		var { thing_id } = await request_new_thing({
			thing: { type: "roadmap_collection", value: new_roadmap_collection },
			thing_privileges: { read: "*", write: [-1] },
		});
		alert("was added SUCCESSFULLY. you will be navigated to it.");
		nav(`/${thing_id}`);
	}
	var existing_roadmaps = cache.filter((ci) => ci.thing.type === "roadmap");

	if (is_admin === false)
		return "only admin (user_id == -1) can submit a new Roadmap Collection.";
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
				options={existing_roadmaps.map((ci) => ({
					title: ci.thing.value.title,
					code: ci.thing_id,
				}))}
				value={new_roadmap_collection["roadmaps"].map(({ id }) => ({
					title: existing_roadmaps.find((ci) => ci.thing_id === id)?.thing.value.title,
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
