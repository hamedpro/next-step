import { cache_item, profile, profile_seed } from "freeflow-core/dist/UnifiedHandler_types";
import { find_active_profile, find_active_profile_seed } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { roadmap_thing, step } from "../../types";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputTextarea } from "primereact/inputtextarea";
import { useNavigate } from "react-router-dom";
export const NewStepModal = ({
	active,
	roadmap,
	roadmap_steps,
	onHide,
}: {
	roadmap: cache_item<roadmap_thing>;
	active: boolean;
	roadmap_steps: cache_item<any>[];
	onHide: () => void;
}) => {
	var nav = useNavigate();
	var freeflow_context = useContext(context);
	var current_profile_seed: profile_seed | undefined = find_active_profile_seed(
		freeflow_context.profiles_seed
	);

	var [new_step, set_new_step] = useState<step>({
		title: "",
		description: "",
		weight: 1,
		resources: [],
		laboratory: null,
		connects_to: [],
		roadmap_id: roadmap.thing_id,
	});

	async function submit_new_step() {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);

		if (current_profile === undefined) {
			alert("there is not any active profile");
			return;
		}
		//console.log(new_step);
		var { meta_id, thing_id } = await freeflow_context.request_new_thing({
			value: {
				type: "step",
				value: new_step,
			},
			unresolved_cache: freeflow_context.unresolved_cache,
			restful_api_endpoint: freeflow_context.rest_endpoint,
			current_profile,
			thing_privileges: { read: "*", write: [-1] },
		});
		onHide();
		nav(`/${thing_id}`);
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
