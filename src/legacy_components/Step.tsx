import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect, useState } from "react";
import { roadmap, step } from "../../types";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { CustomTitle } from "../components/CustomTitle";
import { CustomCard } from "../components/CustomCard";
import { AssetsSection } from "../components/AssetsSection";
import { CustomPanel } from "../components/CustomPanel";
import { useNavigate } from "react-router-dom";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
export const Step = ({ step_data }: { step_data: [number, "step", step] }) => {
	var nav = useNavigate();
	var [use_admin_mode, set_use_admin_mode] = useState(false);
	var { data, server_post_verb, parsed_virtual_localstorage } = useContext(ServerSyncContext);
	var [new_step, set_new_step] = useState<step>(step_data[2]);
	useEffect(() => {
		set_new_step(step_data[2]);
	}, [JSON.stringify(step_data[2])]);
	var parent = data.find((item) => item[0] === step_data[2].roadmap_id) as
		| [number, "roadmap", roadmap]
		| undefined;

	async function save_changes() {
		server_post_verb((prev) => {
			var pointer = prev.find(([id]) => id === step_data[0])?.[2];
			if (pointer === undefined) throw "internal error. could not find the step in cache";
			pointer = new_step;
		});
	}
	if (parent === undefined)
		return (
			"parent of this step could not be found : there is no roadmap with id = " +
			step_data[2].roadmap_id
		);
	var roadmap_steps = data.filter(
		(item) => item[1] === "step" && item[2].roadmap_id === parent?.[0]
	);

	var change_mode = use_admin_mode;

	var active_user = data.find(
		(item) =>
			item[1] === "user" && item[2].username === parsed_virtual_localstorage.active_username
	);
	var done_steps: number[] = active_user?.[2].done_steps || [];
	async function toggle_done_mark() {
		if (active_user === undefined) {
			alert("internal error. active user is undefined");
		}
		server_post_verb((prev) => {
			var pointer = prev.find(([id]) => id === active_user?.[0])?.[2];
			if (pointer.done_steps === undefined) {
				pointer.done_steps = [];
			}
			if (pointer.done_steps.includes(step_data[0])) {
				pointer.done_steps = pointer.done_steps.filter(
					(step_id: number) => step_id !== step_data[0]
				);
			} else {
				pointer.done_steps.push(step_data[0]);
			}
		});
	}
	return (
		<div style={{ padding: "12px" }}>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<CustomTitle
					text={step_data[2].title}
					back_link={`/${step_data[2].roadmap_id}`}
				/>
				<div
					style={{ alignItems: "center", gap: "10px" }}
					className="hidden sm:flex"
				>
					<>
						<ToggleButton
							checked={use_admin_mode}
							onChange={(e) => set_use_admin_mode(e.value)}
							onLabel="Edit Mode On"
							offLabel="Editing Mode Off"
						/>
						<Button
							style={{ height: "fit-content" }}
							onClick={save_changes}
							disabled={JSON.stringify(new_step) === JSON.stringify(step_data[2])}
						>
							Save Changes
						</Button>
					</>
				</div>
			</div>
			<div
				className="sm:hidden flex"
				style={{ gap: "10px" }}
			>
				{active_user !== undefined && (
					<>
						<ToggleButton
							checked={use_admin_mode}
							onChange={(e) => set_use_admin_mode(e.value)}
							onLabel="Edit Mode On"
							offLabel="Editing Mode Off"
							style={{ width: "50%" }}
						/>
						<Button
							onClick={save_changes}
							disabled={JSON.stringify(new_step) === JSON.stringify(step_data[2])}
							style={{ width: "50%", display: "flex", justifyContent: "center" }}
						>
							Save Changes
						</Button>
					</>
				)}
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<p style={{ marginTop: "20px" }}>Title:</p>
				{change_mode === true ? (
					<InputText
						value={new_step.title}
						onChange={(e) => {
							set_new_step((prev) => ({ ...prev, title: e.target.value }));
						}}
						style={{ width: "100%" }}
					/>
				) : (
					<CustomCard>{new_step.title}</CustomCard>
				)}

				<p>Description:</p>
				{change_mode === true ? (
					<InputTextarea
						value={new_step.description}
						onChange={(e) => {
							set_new_step((prev) => ({ ...prev, description: e.target.value }));
						}}
						rows={5}
						style={{ width: "100%" }}
					/>
				) : (
					<CustomCard>{new_step.description}</CustomCard>
				)}
			</div>
			<p>weight:</p>

			<Rating
				disabled={change_mode === false}
				style={{ marginBottom: "20px" }}
				value={new_step.weight}
				onChange={(e) =>
					set_new_step((prev) => {
						if (typeof e.value !== "number")
							throw "internal error. was sure e.value is a number because cancel prop is set to false";
						return { ...prev, weight: e.value };
					})
				}
				cancel={false}
			/>
			<hr />
			<CustomPanel
				bootstrap_icon="bi-list-check"
				panel_title="Progress Tracker"
				icon_title="Track Your Progress Visually"
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						rowGap: "12px",
					}}
				>
					<p>
						Mark steps you have done so we can show you your progress drawn as charts
						and heatmaps. you will not miss where you left anymore!
					</p>
					<b>
						{done_steps.includes(step_data[0])
							? `You have done this step before`
							: `You haven't marked this step as done`}
					</b>
					<ToggleButton
						onChange={toggle_done_mark}
						style={{ width: "fit-content" }}
						checked={done_steps.includes(step_data[0])}
						offIcon={"Mark As Done"}
						onLabel="Mark As Unread"
					/>
				</div>
			</CustomPanel>
			<hr />
			<AssetsSection
				change_mode={change_mode}
				tar_archive_name={"assets" + step_data[2].title + ".tar"}
				file_ids={new_step.assets || []}
				onUpload={(new_file_id) =>
					set_new_step((prev) => ({
						...prev,
						assets: (prev.assets || []).concat(new_file_id),
					}))
				}
				onDelete={(file_id) =>
					set_new_step((prev) => ({
						...prev,
						assets: (prev.assets || []).filter((ass) => ass !== file_id),
					}))
				}
			/>

			<hr style={{ margin: "28px 0px " }} />
			<p style={{ marginTop: "24px" }}>Prerequisites </p>
			{change_mode === true ? (
				<MultiSelect
					options={(
						data.filter(([id, type, value]) => type === "step") as [
							number,
							"step",
							step
						][]
					).map(([id, type, value]) => ({
						title: value.title,
						code: id,
					}))}
					value={new_step["prerequisites"].map((thing_id) => ({
						title: roadmap_steps.find(([id, type, value]) => id === thing_id)?.[2]
							.title,
						code: thing_id,
					}))}
					onChange={(e) =>
						set_new_step((prev) => ({
							...prev,
							prerequisites: e.value.map(
								({ code, title }: { code: number; title: string }) => code
							),
						}))
					}
					optionLabel="title"
					style={{ color: "black" }}
				/>
			) : (
				new_step["prerequisites"].map((thing_id) => (
					<Button
						key={thing_id}
						onClick={() => nav(`/${thing_id}`)}
					>
						{roadmap_steps.find(([id, type, value]) => id === thing_id)?.[2].title}
					</Button>
				))
			)}
			<hr style={{ margin: "28px 0px " }} />
			<Button onClick={() => nav(`/${step_data[0]}/labs`)}>Open Its Laboratories</Button>
		</div>
	);
};
