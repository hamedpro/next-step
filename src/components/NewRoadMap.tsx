import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "freeflow-react";
import { roadmap } from "../../types";
import { find_active_profile } from "freeflow-core/dist/utils";
import { profile } from "freeflow-core/dist/UnifiedHandler_types";

export const NewRoadMap = () => {
	var freeflow_context = useContext(context);
	var nav = useNavigate();
	var [description, set_description] = useState("");
	var [title, set_title] = useState("");
	async function submit() {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not any active profile");
			return;
		}
		var value: roadmap = { title, description, layers: [] };
		var { meta_id, thing_id } = await freeflow_context.request_new_thing({
			value: { type: "roadmap", value },
			unresolved_cache: freeflow_context.unresolved_cache,
			current_profile,
			restful_api_endpoint: freeflow_context.rest_endpoint,
			thing_privileges: { read: "*", write: [current_profile.user_id] },
		});
		alert(`submitted : ${JSON.stringify({ thing_id, meta_id })}`);
	}
	return (
		<div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
			<h1>NewRoadMap</h1>
			<label htmlFor="title_input">title:</label>
			<InputText
				style={{ marginTop: "4px" }}
				value={title}
				onChange={(e) => {
					set_title(e.target.value);
				}}
			/>
			<br />
			<label htmlFor="description_textarea">description:</label>
			<InputTextarea
				id="description_textarea"
				onChange={(e) => set_description(e.target.value)}
				value={description}
				rows={8}
				style={{ marginTop: "4px" }}
			/>

			<Button
				onClick={submit}
				style={{ marginTop: "8px" }}
			>
				Submit
			</Button>
			<Button
				onClick={() => nav("/roadmaps/import")}
				style={{ marginTop: "5px" }}
			>
				import an existing RoadMap
			</Button>
		</div>
	);
};
