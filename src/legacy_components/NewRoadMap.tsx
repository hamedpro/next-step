import { Button } from "primereact/button";
import { validate } from "json-schema";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { TabMenu } from "primereact/tabmenu";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roadmap, step } from "../../types";
import { CustomTitle } from "../components/CustomTitle";
import ReactMarkdown from "react-markdown";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";

export const NewRoadMap = () => {
	var nav = useNavigate();

	var { data, server_post_verb } = useContext(ServerSyncContext);

	var [description, set_description] = useState("");
	var [title, set_title] = useState("");

	async function submit() {
		var value: roadmap = { title, description };
		var ref: { roadmap_id: number | undefined } = { roadmap_id: undefined };
		server_post_verb((prev, max_existing_id) => {
			ref.roadmap_id = max_existing_id + 1;
			prev.push([ref.roadmap_id, "roadmap", value]);
		});
		if (ref.roadmap_id === undefined) {
			throw new Error("internal error. roadmap_id must not be undefined here");
		}
		if (mode === "bootstrap_mode") {
			var steps = JSON.parse(bootstrap_json);
			var ref2: { last_submitted_step_id: number | undefined } = {
				last_submitted_step_id: undefined,
			};
			for (var i = 0; i < steps.length; i++) {
				var step = steps[i];
				server_post_verb((prev, max_existing_id) => {
					var new_step: step = {
						title: step.title,
						description: step.description,
						roadmap_id: ref.roadmap_id as number,
						weight: 0,
						prerequisites:
							ref2.last_submitted_step_id === undefined
								? []
								: [ref2.last_submitted_step_id],
					};
					ref2.last_submitted_step_id = max_existing_id + 1;
					prev.push([ref2.last_submitted_step_id, "step", new_step]);
				});
			}
		}
		alert(`submitted : roadmap_id = ${ref.roadmap_id}`);
		nav(`/${ref.roadmap_id}`);
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
