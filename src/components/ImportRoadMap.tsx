import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { context } from "freeflow-react";
import validator from "validator";
import create_fake_roadmap_layers from "../create_fake_roadmap_layers";
import { profile } from "freeflow-core/dist/UnifiedHandler_types";
import { find_active_profile } from "freeflow-core/dist/utils";
export const ImportRoadMap = () => {
	var freeflow_context = useContext(context);
	var [value, set_value] = useState("");
	var json_is_valid = validator.isJSON(value);

	async function submit_new_roadmap() {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not an active profile.");
			return;
		}
		var parsed_value = JSON.parse(value);
		var result = await freeflow_context.request_new_thing({
			value: { type: "roadmap", value: parsed_value },
			restful_api_endpoint: freeflow_context.rest_endpoint,
			unresolved_cache: freeflow_context.unresolved_cache,
			current_profile,
			thing_privileges: { read: "*", write: [current_profile.user_id] },
		});
		alert(`was submitted : ${JSON.stringify(result)}`);
	}
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<h1>NewRoadMap</h1>
			<label htmlFor="roadmap_json_textarea">enter roadmap as plain JSON: </label>
			<InputTextarea
				onChange={(e) => set_value(e.target.value)}
				value={value}
				style={{ height: "50vh", marginTop: "8px" }}
				id="roadmap_json_textarea"
			/>
			{value !== "" && json_is_valid === false && (
				<span
					style={{
						marginTop: "8px",
						marginBottom: "12px",
					}}
				>
					<i
						className="bi bi-exclamation-octagon"
						style={{ marginRight: "4px" }}
					></i>
					provided JSON is invalid
				</span>
			)}
			<Button
				onClick={submit_new_roadmap}
				disabled={json_is_valid === false}
				style={{ marginTop: "5px" }}
			>
				Submit
			</Button>
			<Button
				onClick={() =>
					set_value(
						JSON.stringify({
							title: "something",
							description: "how to create that something!",
							layers: create_fake_roadmap_layers(),
						})
					)
				}
				style={{ marginTop: "5px" }}
			>
				create a random roadmap
			</Button>
		</div>
	);
};
