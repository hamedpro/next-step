import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "freeflow-react";
import { roadmap } from "../../types";
import { find_active_profile } from "freeflow-core/dist/utils";
import { profile } from "freeflow-core/dist/UnifiedHandler_types";
import { Toast } from "primereact/toast";
import { CustomTitle } from "./CustomTitle";
export const NewRoadMap = () => {
	//const toast_ref = useRef<Toast>(null);
	var freeflow_context = useContext(context);
	var nav = useNavigate();
	var [description, set_description] = useState("");
	var [title, set_title] = useState("");
	async function submit() {
		//toast_ref.current?.show({ severity: "info", summary: "Info", detail: "Message Content" });

		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not any active profile");
			return;
		}
		var value: roadmap = { title, description };
		var { meta_id, thing_id } = await freeflow_context.request_new_thing({
			thing: { type: "roadmap", value },
			thing_privileges: { read: "*", write: [current_profile.user_id] },
		});
		alert(`submitted : ${JSON.stringify({ thing_id, meta_id })}`);
		nav(`/${thing_id}`);
	}
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flexWrap: "wrap",
				maxWidth: "500px",
				padding: "12px",
			}}
		>
			<CustomTitle
				back_link="/roadmaps"
				text="New RoadMap"
			/>
			<label>title:</label>
			<InputText
				style={{ marginTop: "8px" }}
				value={title}
				onChange={(e) => {
					set_title(e.target.value);
				}}
			/>
			<br />
			<label>description:</label>
			<InputTextarea
				onChange={(e) => set_description(e.target.value)}
				value={description}
				rows={8}
				style={{ marginTop: "8px" }}
			/>

			<Button
				onClick={submit}
				style={{ marginTop: "8px" }}
			>
				Submit
			</Button>
		</div>
	);
};
