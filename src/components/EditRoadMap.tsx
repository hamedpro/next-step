import { cache_item, profile, thing_base } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roadmap } from "../../types";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { find_active_profile, request_new_transaction } from "freeflow-core/dist/utils";
import { RoadMapLayerEditor } from "./RoadMapLayerEditor";
import { Message } from "primereact/message";

export const EditRoadMap = ({
	roadmap,
}: {
	roadmap: cache_item<{ type: "roadmap"; value: roadmap }>;
}) => {
	var nav = useNavigate();
	var freeflow_context = useContext(context);
	var [title_input, set_title_input] = useState("");
	var [description_input, set_description_input] = useState("");
	useEffect(() => {
		set_title_input(roadmap.thing.value.title);
	}, [roadmap.thing.value.title]);
	useEffect(() => {
		set_description_input(roadmap.thing.value.description);
	}, [roadmap.thing.value.description]);
	async function update_data(field: "title" | "description") {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not an active profile.");
			return;
		}
		try {
			await freeflow_context.request_new_transaction({
				new_thing_creator: (prev) => ({
					...prev,
					value: {
						...prev.value,
						[field]: field === "title" ? title_input : description_input,
					},
				}),
				thing_id: roadmap.thing_id,
				restful_api_endpoint: freeflow_context.rest_endpoint,
				jwt: current_profile.jwt,
				unresolved_cache: freeflow_context.unresolved_cache,
			});
		} catch (error: any) {
			console.log(error);
			alert("error was logged in console");
		}
	}
	async function append_new_layer() {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not an active profile.");
			return;
		}
		await request_new_transaction({
			new_thing_creator: (prev: cache_item<{ type: "roadmap"; value: roadmap }>["thing"]) => {
				prev.value.layers.push([]);
				return prev;
			},

			thing_id: roadmap.thing_id,
			unresolved_cache: freeflow_context.unresolved_cache,
			jwt: current_profile.jwt,
			restful_api_endpoint: freeflow_context.rest_endpoint,
		});
	}
	return (
		<div style={{ padding: "8px" }}>
			<h1>EditRoadMap</h1>

			<b style={{ margin: "20px 0px 8px 0px", display: "block" }}>Title:</b>
			<div className="p-inputgroup">
				<InputText
					value={title_input}
					onChange={(e) => {
						set_title_input(e.target.value);
					}}
				/>
				{title_input !== roadmap.thing.value.title && (
					<Button onClick={() => update_data("title")}>
						<i className="bi bi-pencil-square" />
					</Button>
				)}
			</div>

			<b style={{ margin: "20px 0px 8px 0px", display: "block" }}>Description: </b>
			<InputTextarea
				rows={5}
				style={{ width: "100%" }}
				value={description_input}
				onChange={(e) => {
					set_description_input(e.target.value);
				}}
			/>
			{description_input !== roadmap.thing.value.description && (
				<Button
					style={{ marginTop: "8px" }}
					onClick={() => update_data("description")}
				>
					<span>Update Description</span>
					<i className="bi bi-pencil-square" />
				</Button>
			)}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					margin: "20px 0px 8px 0px",
				}}
			>
				<b style={{ display: "block" }}>Layers: </b>
				<Button
					onClick={append_new_layer}
					size="small"
					style={{ padding: "8px 12px" }}
				>
					<i
						className="bi bi-plus"
						style={{ fontSize: "large" }}
					/>
					New Layer
				</Button>
			</div>
			{roadmap.thing.value.layers.length === 0 && (
				<Message text="this roadmap has not any layers yet" />
			)}
			{roadmap.thing.value.layers.map((layer) => (
				<RoadMapLayerEditor
					key={Math.random().toString()}
					{...{ roadmap, layer }}
				/>
			))}
		</div>
	);
};
