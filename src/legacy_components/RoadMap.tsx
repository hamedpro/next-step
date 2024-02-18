import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { NewNodeModal } from "../components/NewNodeModal";
import { steps_to_dot } from "../../helpers";
import Graphviz from "graphviz-react";
import { CustomTitle } from "../components/CustomTitle";
import { roadmap, step, user } from "../../types";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
export const RoadMap = ({ roadmap_data }: { roadmap_data: [number, "roadmap", roadmap] }) => {
	var roadmap = roadmap_data[2];
	var { server_post_verb, data, parsed_virtual_localstorage } = useContext(ServerSyncContext);

	var [new_step_modal, set_new_step_modal] = useState<{ active: boolean }>({ active: false });
	var nav = useNavigate();

	var [title_input, set_title_input] = useState("");
	var [description_input, set_description_input] = useState("");
	useEffect(() => {
		set_title_input(roadmap.title);
	}, [roadmap.title]);
	useEffect(() => {
		set_description_input(roadmap.description);
	}, [roadmap.description]);

	async function update_data(field: "title" | "description") {
		server_post_verb((prev) => {
			prev.find(([id]) => id === roadmap_data[0])?.[2].assign({
				[field]: field === "title" ? title_input : description_input,
			});
		});
	}
	var steps = data.filter((i) => i[1] === "step" && i[2].roadmap_id === roadmap_data[0]) as [
		number,
		"step",
		step
	][];

	var dot = useMemo(() => steps_to_dot(steps), [JSON.stringify(steps)]);

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
	var active_user = data.find(
		([id, type, value]) =>
			parsed_virtual_localstorage.active_username === value.username && type === "user"
	) as [number, "user", user];
	async function toggle_mark_primary_roadmap() {
		if (active_user === undefined) {
			alert("you are not logged in");
			return;
		}

		server_post_verb((prev) => {
			prev.find(([id, type, value]) => type === "user" && id === active_user[0])?.[2].assign({
				active_roadmap: roadmap_data[0],
			});
		});
	}
	return (
		<>
			<div style={{ padding: "12px", maxWidth: "768px" }}>
				<NewNodeModal
					onHide={() => {
						set_new_step_modal({
							active: false,
						});
					}}
					roadmap_data={roadmap_data}
					active={new_step_modal.active}
					roadmap_steps={steps}
				/>

				<CustomTitle
					back_link="/roadmaps"
					text={roadmap.title}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						{active_user && (
							<>
								{active_user[2].active_roadmap === roadmap_data[0] ? (
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

				<div className="p-inputgroup">
					<InputText
						value={title_input}
						onChange={(e) => {
							set_title_input(e.target.value);
						}}
					/>
					{title_input !== roadmap.title && (
						<Button onClick={() => update_data("title")}>
							<i className="bi bi-pencil-square" />
						</Button>
					)}
				</div>

				<b style={{ margin: "20px 0px 8px 0px", display: "block" }}>Description: </b>
				<InputTextarea
					rows={10}
					style={{ width: "100%" }}
					value={description_input}
					onChange={(e) => {
						set_description_input(e.target.value);
					}}
				/>
				{description_input !== roadmap.description && (
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
