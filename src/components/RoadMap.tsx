import { cache_item, profile, profile_seed } from "freeflow-core/dist/UnifiedHandler_types";
import { context } from "freeflow-react";
import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { roadmap } from "../../types";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { find_active_profile, find_active_profile_seed } from "freeflow-core/dist/utils";
import { Message } from "primereact/message";
import { NewStepModal } from "./NewStepModal";
import { CustomCard } from "./CustomCard";
import { roadmap_to_dot } from "../helpers";
import Graphviz from "graphviz-react";
import { CustomTitle } from "./CustomTitle";
export const RoadMap = ({
	roadmap,
}: {
	roadmap: cache_item<{ type: "roadmap"; value: roadmap }>;
}) => {
	var [new_step_modal, set_new_step_modal] = useState<{ active: boolean }>({ active: false });
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
			});
		} catch (error: any) {
			console.log(error);
			alert("error was logged in console");
		}
	}
	var steps = freeflow_context.cache.filter(
		(ci) => ci.thing.type === "step" && ci.thing.value.roadmap_id === roadmap.thing_id
	);

	var current_profile_seed: profile_seed | undefined = find_active_profile_seed(
		freeflow_context.profiles_seed
	);
	var is_admin = current_profile_seed !== undefined && current_profile_seed.user_id === -1;
	var dot = roadmap_to_dot(freeflow_context.cache, roadmap);
	var active_user = freeflow_context.cache.find(
		(ci) => ci.thing_id === current_profile_seed?.user_id
	);

	//console.log(dot);
	useEffect(() => {
		document.querySelectorAll(".node").forEach((element) => {
			/* //removing all event listeners
			var new_element = element.cloneNode(true);
			element.parentNode?.replaceChild(new_element, element); */

			element.addEventListener("click", () => {
				nav("/" + Number(element.id.split("-")[1]));
			});
		});
	}, [dot]);
	async function toggle_mark_primary_roadmap() {
		if (active_user?.thing_id === undefined || active_user?.thing_id <= 0) {
			alert("there's not any active profile or its a virtual user like anonymous or system.");
			return;
		}
		await freeflow_context.request_new_transaction({
			new_thing_creator: (prev) => ({
				...prev,
				value: {
					...prev.value,
					active_roadmap:
						prev.value.active_roadmap === roadmap.thing_id
							? undefined
							: roadmap.thing_id,
				},
			}),
			thing_id: active_user.thing_id,
		});
	}
	return (
		<>
			<div style={{ padding: "12px", maxWidth: "768px" }}>
				<NewStepModal
					onHide={() => {
						set_new_step_modal({
							active: false,
						});
					}}
					roadmap={roadmap}
					active={new_step_modal.active}
					roadmap_steps={steps}
				/>

				<CustomTitle
					back_link="/roadmaps"
					text={roadmap.thing.value.title}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						{active_user?.thing_id !== undefined && active_user?.thing_id > 0 && (
							<>
								{active_user.thing.value.active_roadmap === roadmap.thing_id ? (
									<Button onClick={toggle_mark_primary_roadmap}>
										Unmark Primary Roadmap
									</Button>
								) : (
									<Button onClick={toggle_mark_primary_roadmap}>
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
						{title_input !== roadmap.thing.value.title && (
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
					<h3 style={{ display: "block" }}>Steps: </h3>
					<Button
						onClick={() => set_new_step_modal({ active: true })}
						size="small"
						style={{ padding: "8px 12px" }}
					>
						<i
							className="bi bi-plus"
							style={{ fontSize: "large" }}
						/>
						New Step
					</Button>
				</div>
				<hr style={{ marginBottom: "28px" }} />
				{steps.length === 0 ? (
					<Message text="this roadmap has not any steps yet" />
				) : (
					<div style={{ width: "100%", overflowX: "scroll" }}>
						<Graphviz
							options={{ useWorker: false }}
							dot={dot}
						/>
					</div>
				)}
			</div>
		</>
	);
};
