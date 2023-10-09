import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import { roadmap_collection_thing } from "../../types";

import { profile, profile_seed } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { find_active_profile, find_active_profile_seed } from "freeflow-core/dist/utils";
import { Message } from "primereact/message";
import { CustomCard } from "./CustomCard";
import { CustomTitle } from "./CustomTitle";
export const RoadmapCollection = ({
	roadmap_collection,
}: {
	roadmap_collection: cache_item<roadmap_collection_thing>;
}) => {
	var nav = useNavigate();
	var freeflow_context = useContext(context);
	var [title_input, set_title_input] = useState("");
	var [description_input, set_description_input] = useState("");
	useEffect(() => {
		set_title_input(roadmap_collection.thing.value.title);
	}, [roadmap_collection.thing.value.title]);
	useEffect(() => {
		set_description_input(roadmap_collection.thing.value.description);
	}, [roadmap_collection.thing.value.description]);
	async function update_data(field: "title" | "description") {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not any active profile.");
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
				thing_id: roadmap_collection.thing_id,
			});
		} catch (error: any) {
			console.log(error);
			alert("error was logged in console");
		}
	}

	var current_profile_seed: profile_seed | undefined = find_active_profile_seed(
		freeflow_context.profiles_seed
	);
	var is_admin = current_profile_seed !== undefined && current_profile_seed.user_id === -1;

	var active_user = freeflow_context.cache.find(
		(ci) => ci.thing_id === current_profile_seed?.user_id
	);

	async function toggle_mark_primary_collection() {
		if (active_user?.thing_id === undefined || active_user?.thing_id <= 0) {
			alert("there's not any active profile or its a virtual user like anonymous or system.");
			return;
		}
		await freeflow_context.request_new_transaction({
			new_thing_creator: (prev) => ({
				...prev,
				value: {
					...prev.value,
					active_roadmap_collection:
						prev.value.active_roadmap_collection === roadmap_collection.thing_id
							? undefined
							: roadmap_collection.thing_id,
				},
			}),
			thing_id: active_user.thing_id,
		});
	}
	return (
		<>
			<div style={{ padding: "12px", maxWidth: "768px" }}>
				<CustomTitle
					back_link="/roadmaps"
					text={roadmap_collection.thing.value.title}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						{active_user?.thing_id !== undefined && active_user?.thing_id > 0 && (
							<>
								{active_user.thing.value.active_roadmap_collection ===
								roadmap_collection.thing_id ? (
									<Button onClick={toggle_mark_primary_collection}>
										Unmark Primary Roadmap
									</Button>
								) : (
									<Button onClick={toggle_mark_primary_collection}>
										Mark As Primary Roadmap
									</Button>
								)}
							</>
						)}
					</div>
				</CustomTitle>
				<b style={{ margin: "20px 0px 8px 0px", display: "block" }}>Title:</b>
				{is_admin ? (
					<div className="p-inputgroup">
						<InputText
							value={title_input}
							onChange={(e) => {
								set_title_input(e.target.value);
							}}
						/>
						{title_input !== roadmap_collection.thing.value.title && (
							<Button onClick={() => update_data("title")}>
								<i className="bi bi-pencil-square" />
							</Button>
						)}
					</div>
				) : (
					<CustomCard children={title_input} />
				)}

				<b style={{ margin: "20px 0px 8px 0px", display: "block" }}>Description: </b>
				{is_admin ? (
					<InputTextarea
						rows={10}
						style={{ width: "100%" }}
						value={description_input}
						onChange={(e) => {
							set_description_input(e.target.value);
						}}
					/>
				) : (
					<CustomCard children={description_input} />
				)}
				{description_input !== roadmap_collection.thing.value.description && (
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
					<h3 style={{ display: "block" }}>Roadmaps: </h3>
				</div>
				<hr style={{ marginBottom: "28px" }} />
				{roadmap_collection.thing.value.roadmaps.length === 0 ? (
					<Message text="this roadmap has not any roadmaps yet" />
				) : (
					roadmap_collection.thing.value.roadmaps
						.map((roadmap) => roadmap.id)
						.map((roadmap_id) => (
							<Button onClick={() => nav(`/${roadmap_id}`)}>
								{
									freeflow_context.cache.find((ci) => ci.thing_id === roadmap_id)
										?.thing.value.title
								}
							</Button>
						))
				)}
			</div>
		</>
	);
};
