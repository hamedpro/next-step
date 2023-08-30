import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { context } from "freeflow-react";
import validator from "validator";
import create_fake_roadmap_layers from "../create_fake_roadmap_layers";
export const NewRoadMap = () => {
	var freeflow_context = useContext(context);
	var [value, set_value] = useState("");
	var json_is_valid = validator.isJSON(value);

	async function submit_new_roadmap() {
		var parsed_value = JSON.parse(value);
		await freeflow_context.request_new_transaction({
			new_thing_creator: () => ({ type: "roadmap", value: parsed_value }),
			thing_id: undefined,
			unresolved_cache: freeflow_context.unresolved_cache,
			restful_api_endpoint: "http://localhost:5001",
			jwt: undefined,
		});
		alert("was submitted successfully.");
	}
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<h1>NewRoadMap</h1>
			<InputTextarea
				onChange={(e) => set_value(e.target.value)}
				value={value}
				style={{ height: "50vh" }}
			/>
			<span style={{ marginTop: "15px" }}>enter a valid json </span>
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
