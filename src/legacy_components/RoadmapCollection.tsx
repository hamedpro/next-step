import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { CustomCard } from "../components/CustomCard";
import { CustomTitle } from "../components/CustomTitle";
import { roadmap_collection, user } from "../../types";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
export const RoadmapCollection = ({
	roadmap_collection_data,
}: {
	roadmap_collection_data: [number, "roadmap_collection", roadmap_collection];
}) => {
	var nav = useNavigate();
	var { server_post_verb, data, parsed_virtual_localstorage } = useContext(ServerSyncContext);
	var [title_input, set_title_input] = useState("");
	var [description_input, set_description_input] = useState("");
	useEffect(() => {
		set_title_input(roadmap_collection_data[2].title);
	}, [roadmap_collection_data[2].title]);
	useEffect(() => {
		set_description_input(roadmap_collection_data[2].description);
	}, [roadmap_collection_data[2].description]);
	async function update_data(field: "title" | "description") {
		server_post_verb((prev) => {
			prev.find(([id]) => id === roadmap_collection_data[0])?.[2].assign({
				[field]: field === "title" ? title_input : description_input,
			});
		});
	}
	var active_user = data.find(
		([id, type, value]) =>
			parsed_virtual_localstorage.active_username === value.username && type === "user"
	) as [number, "user", user];
	async function toggle_mark_primary_collection() {
		server_post_verb((prev) => {
			var active_user = prev.find(
				([id, type, value]) =>
					parsed_virtual_localstorage.active_username === value.username &&
					type === "user"
			) as [number, "user", user];
			active_user[2] = {
				...active_user[2],
				active_roadmap_collection:
					active_user[2].active_roadmap_collection === roadmap_collection_data[0]
						? undefined
						: roadmap_collection_data[0],
			};
		});
	}
	return (
		<>
			<div style={{ padding: "12px", maxWidth: "768px" }}>
				<CustomTitle
					back_link="/roadmaps"
					text={roadmap_collection_data[2].title}
				>
					<div style={{ display: "flex", flexDirection: "row" }}>
						{active_user && (
							<>
								<Button onClick={toggle_mark_primary_collection}>
									{active_user[2].active_roadmap_collection ===
									roadmap_collection_data[0]
										? "Unmark Primary Roadmap"
										: "Mark As Primary Roadmap"}
								</Button>
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
					{title_input !== roadmap_collection_data[2].title && (
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
				{description_input !== roadmap_collection_data[2].description && (
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
				{roadmap_collection_data[2].roadmaps.length === 0 ? (
					<Message text="this roadmap has not any roadmaps yet" />
				) : (
					roadmap_collection_data[2].roadmaps
						.map((roadmap) => roadmap.id)
						.map((roadmap_id) => (
							<Button onClick={() => nav(`/${roadmap_id}`)}>
								{data.find(([id, type, value]) => id === roadmap_id)?.[2].title}
							</Button>
						))
				)}
			</div>
		</>
	);
};
