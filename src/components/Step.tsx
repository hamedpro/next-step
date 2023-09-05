import { cache_item, core_thing, profile_seed } from "freeflow-core/dist/UnifiedHandler_types";
import { step_thing } from "../../types";
import { context } from "freeflow-react";
import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect, useState } from "react";
import { step } from "../../types";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { CustomTitle } from "./CustomTitle";
import { CustomCard } from "./CustomCard";
export const Step = ({ step }: { step: cache_item<step_thing> }) => {
	var [use_admin_mode, set_use_admin_mode] = useState(false);
	var { cache, request_new_transaction, unresolved_cache, rest_endpoint, profiles_seed } =
		useContext(context);
	var [new_step, set_new_step] = useState<step>(step.thing.value);
	useEffect(() => {
		set_new_step(step.thing.value);
	}, [JSON.stringify(step.thing.value)]);
	useEffect(() => {}, []);
	var parent: cache_item<core_thing> | undefined = cache.find(
		(ci) => ci.thing_id === step.thing.value.roadmap_id
	);

	var [new_resource, set_new_resource] = useState<{ link: string; title: string }>({
		link: "",
		title: "",
	});
	var current_profile_seed: profile_seed | undefined = find_active_profile_seed(profiles_seed);
	async function save_changes() {
		if (current_profile_seed === undefined) {
			alert("there is not any active profile seed. login first");
			return;
		}
		await request_new_transaction({
			new_thing_creator: (prev) => ({ type: "step", value: new_step }),
			unresolved_cache,
			thing_id: step.thing_id,
			restful_api_endpoint: rest_endpoint,
			jwt: current_profile_seed.jwt,
		});
	}
	if (parent === undefined)
		return (
			"parent of this step could not be found : there is no roadmap with id = " +
			step.thing.value.roadmap_id
		);
	var roadmap_steps = cache.filter(
		(ci) => ci.thing.type === "step" && ci.thing.value.roadmap_id === parent?.thing_id
	);
	var is_admin = current_profile_seed !== undefined && current_profile_seed.user_id === -1;
	var change_mode = is_admin && use_admin_mode;
	return (
		<div style={{ padding: "12px" }}>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<CustomTitle
					text={step.thing.value.title}
					back_link={`/${step.thing.value.roadmap_id}`}
				/>
				<div
					style={{ alignItems: "center", gap: "10px" }}
					className="hidden sm:flex"
				>
					{is_admin && (
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
								disabled={
									JSON.stringify(new_step) === JSON.stringify(step.thing.value)
								}
							>
								Save Changes
							</Button>
						</>
					)}
				</div>
			</div>
			<div
				className="sm:hidden flex"
				style={{ gap: "10px" }}
			>
				{current_profile_seed !== undefined && current_profile_seed.user_id === -1 && (
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
							disabled={JSON.stringify(new_step) === JSON.stringify(step.thing.value)}
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
			<p>Resources:</p>
			<DataTable
				value={new_step.resources}
				tableStyle={{ width: "100%", borderRadius: "4px", overflow: "hidden" }}
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
			{change_mode && (
				<>
					<p style={{ margin: "15px 0px 10px 0px " }}>Add New Resources:</p>
					<div
						style={{
							alignItems: "center",
							gap: "10px",
							marginBottom: "28px",
							width: "100%",
						}}
						className="flex flex-col sm:flex-row"
					>
						<InputText
							className="w-full"
							value={new_resource["title"]}
							placeholder="Enter a title"
							onChange={(e) => {
								set_new_resource((prev) => ({ ...prev, title: e.target.value }));
							}}
						/>

						<InputText
							className="grow w-full"
							value={new_resource["link"]}
							placeholder="Enter a link"
							onChange={(e) => {
								set_new_resource((prev) => ({ ...prev, link: e.target.value }));
							}}
						/>
						<Button
							className="w-full"
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
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
					</div>
				</>
			)}

			<hr style={{ margin: "28px 0px " }} />
			<p style={{ marginTop: "24px" }}>Next Steps: </p>
			{change_mode === true ? (
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
					style={{ color: "black" }}
				/>
			) : (
				new_step["connects_to"].map((thing_id) => (
					<Button key={thing_id}>
						{roadmap_steps.find((ci) => ci.thing_id === thing_id)?.thing.value.title}
					</Button>
				))
			)}
		</div>
	);
};
