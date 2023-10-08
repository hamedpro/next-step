import { Button } from "primereact/button";
import { validate } from "json-schema";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "freeflow-react";
import { roadmap } from "../../types";
import { find_active_profile } from "freeflow-core/dist/utils";
import { profile } from "freeflow-core/dist/UnifiedHandler_types";
import { CustomTitle } from "./CustomTitle";
import ReactMarkdown from "react-markdown";
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
		var roadmap_id = (
			await freeflow_context.request_new_thing({
				thing: { type: "roadmap", value },
				thing_privileges: { read: "*", write: [current_profile.user_id] },
			})
		).thing_id;
		if (mode === "bootstrap_mode") {
			var steps = JSON.parse(bootstrap_json);
			var last_submitted_step_id: number | undefined = undefined;
			for (var i = 0; i < steps.length; i++) {
				var step = steps[i];
				last_submitted_step_id = (
					await freeflow_context.request_new_thing({
						thing: {
							type: "step",
							value: {
								title: step.title,
								description: step.description,
								prerequisites:
									last_submitted_step_id === undefined
										? []
										: [last_submitted_step_id],
								roadmap_id,
							},
						},
						thing_privileges: { read: "*", write: [-1] },
					})
				).thing_id;
			}
		}
		alert(`submitted : roadmap_id = ${roadmap_id}`);
		nav(`/${roadmap_id}`);
	}
	var [mode, set_mode] = useState<"bootstrap_mode" | "init_mode">("bootstrap_mode");
	var [bootstrap_json, set_bootstrap_json] = useState<string>("[]");
	var json_schema_is_valid: boolean = false;
	try {
		var parsed_json = JSON.parse(bootstrap_json);
		json_schema_is_valid = validate(parsed_json, {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: { type: "string" },
					description: { type: "string" },
				},
				required: ["title", "description"],
			},
		}).valid;
	} catch (error) {
		json_schema_is_valid = false;
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
			<TabMenu
				style={{ marginBottom: "20px", borderRadius: "8px" }}
				model={[
					{ icon: "bi", label: "Init Mode" },
					{ icon: "bi", label: "Bootstrap Mode" },
				]}
				activeIndex={mode === "init_mode" ? 0 : 1}
				onTabChange={(e) => set_mode(e.index === 0 ? "init_mode" : "bootstrap_mode")}
			/>

			<>
				{mode === "init_mode" ? (
					<p>Init Mode: Create an empty roadmap and continue filling it manualy.</p>
				) : (
					<p>
						in Bootstrap Mode You can paste a generated roadmap base and it will be
						created with its connections in a single click. you can use Generative AI to
						boost your productivity.
					</p>
				)}
				<label>title:</label>
				<InputText
					style={{ marginTop: "8px" }}
					value={title}
					onChange={(e) => {
						set_title(e.target.value);
					}}
				/>

				<label style={{ marginTop: "8px" }}>description:</label>
				<InputTextarea
					onChange={(e) => set_description(e.target.value)}
					value={description}
					rows={8}
					style={{ marginTop: "8px" }}
				/>
			</>

			{mode === "bootstrap_mode" && (
				<>
					<h3 style={{ margin: "10px 0px" }}>Valid JSON Schema</h3>
					<p style={{ margin: "0px" }}>
						a list of items(steps). each step must be in this format:
					</p>
					<ReactMarkdown>
						{"```" + "{title : string , description : string}" + "```"}
					</ReactMarkdown>
					<label>JSON:</label>
					<InputText
						style={{ marginTop: "8px" }}
						value={bootstrap_json}
						onChange={(e) => {
							set_bootstrap_json(e.target.value);
						}}
					/>
				</>
			)}
			{json_schema_is_valid === false && mode === "bootstrap_mode" && (
				<p>JSON schema is not valid.</p>
			)}
			<Button
				onClick={submit}
				style={{ marginTop: "8px" }}
				disabled={mode === "bootstrap_mode" && json_schema_is_valid === false}
			>
				Submit
			</Button>
		</div>
	);
};
