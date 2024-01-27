import { Dialog } from "primereact/dialog";
import { useContext, useState } from "react";
import { roadmap, step } from "../types";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useNavigate } from "react-router-dom";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
export const NewStepModal = ({
	active,
	roadmap_data,
	roadmap_steps,
	onHide,
}: {
	roadmap_data: [number, "roadmap", roadmap];
	active: boolean;
	roadmap_steps: [number, "step", step][];
	onHide: () => void;
}) => {
	var nav = useNavigate();
	var { data, parsed_virtual_localstorage, server_post_verb } = useContext(ServerSyncContext);

	var [new_step, set_new_step] = useState<step>({
		title: "",
		description: "",
		weight: 1,
		assets: [],
		prerequisites: [],
		roadmap_id: roadmap_data[0],
	});

	async function submit_new_step() {
		server_post_verb((prev, max_existing_id) => {
			prev.push([max_existing_id + 1, "step", new_step]);
		});
		onHide();
	}
	return (
		<Dialog
			visible={active}
			onHide={onHide}
			header="New Step"
		>
			<div style={{ display: "flex", flexDirection: "column", minWidth: "300px" }}>
				<p style={{ marginTop: "20px" }}>Title:</p>
				<InputText
					value={new_step.title}
					onChange={(e) => {
						set_new_step((prev) => ({ ...prev, title: e.target.value }));
					}}
					style={{ width: "100%" }}
				/>

				<p>Description:</p>
				<InputTextarea
					value={new_step.description}
					onChange={(e) => {
						set_new_step((prev) => ({ ...prev, description: e.target.value }));
					}}
					rows={5}
					style={{ width: "100%" }}
				/>

				<Button
					style={{
						width: "100%",
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
					onClick={submit_new_step}
					disabled={!new_step["title"]}
				>
					Continue Creating
				</Button>
			</div>
		</Dialog>
	);
};
