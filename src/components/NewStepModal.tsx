import { cache_item, profile, profile_seed, thing } from "freeflow-core/dist/UnifiedHandler_types";
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

	var [new_resource, set_new_resource] = useState<{ link: string; title: string }>({
		link: "",
		title: "",
	});
	async function submit_new_step() {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);

		if (current_profile === undefined) {
			alert("there is not any active profile");
			return;
		}
		//console.log(new_step);
		await freeflow_context.request_new_thing({
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
	}
	return (
		<Dialog
			visible={active}
			onHide={onHide}
			header="New Step"
		>
			<div
				style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", columnGap: "20px" }}
			>
				<div>
					<p style={{ marginTop: "0px" }}>Title:</p>
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

					<p>weight:</p>

					<Rating
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
					<p>Resources:</p>
					<DataTable
						value={new_step.resources}
						tableStyle={{ width: "100%" }}
					>
						<Column
							field="title"
							header="Title"
						/>
						<Column
							field="link"
							header="Link"
						/>
					</DataTable>
				</div>
				<div>
					<Panel header="New Resource:">
						<p style={{ marginTop: "0px" }}>Title:</p>
						<InputText
							value={new_resource["title"]}
							onChange={(e) => {
								set_new_resource((prev) => ({ ...prev, title: e.target.value }));
							}}
							style={{ width: "100%" }}
						/>
						<p>Link:</p>
						<InputText
							value={new_resource["link"]}
							onChange={(e) => {
								set_new_resource((prev) => ({ ...prev, link: e.target.value }));
							}}
							style={{ width: "100%" }}
						/>
						<Button
							style={{ marginTop: "10px" }}
							onClick={() => {
								set_new_step((prev) => ({
									...prev,
									resources: [...prev.resources, new_resource],
								}));
								set_new_resource({ title: "", link: "" });
							}}
						>
							Add
						</Button>
					</Panel>
					<p>Connects To:</p>
					<MultiSelect
						options={roadmap_steps.map((ci) => ({
							title: ci.thing.value.title,
							code: ci.thing_id,
						}))}
						value={new_step["connects_to"].map((thing_id) => ({
							title: roadmap_steps.find((ci) => ci.thing_id === thing_id)?.thing.value
								.title,
							code: thing_id,
						}))}
						onChange={(e) =>
							set_new_step((prev) => ({
								...prev,
								connects_to: e.value.map(
									({ code, title }: { code: number; title: string }) => code
								),
							}))
						}
						optionLabel="title"
					/>
					<Button
						style={{ width: "100%", marginTop: "10px" }}
						onClick={submit_new_step}
					>
						Submit This New Step
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
