import { useContext } from "react";
import { lab_thing } from "../../types";
import { context } from "freeflow-react";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { CustomTitle } from "./CustomTitle";
import { Lab } from "./Lab";
import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
export const StepLabs = () => {
	var { cache, request_new_thing, profiles_seed } = useContext(context);
	var active_prof_seed = find_active_profile_seed(profiles_seed);
	var step_id = Number(useParams().thing_id);
	if (cache.find((ci) => ci.thing_id === step_id && ci.thing.type === "step") === undefined)
		return `couldn't find a step with id = ${step_id}`;
	var labs = cache.filter(
		(ci) => ci.thing.type === "lab" && ci.thing.value.parent_step_id === step_id
	);
	async function new_lab() {
		await request_new_thing({
			thing: {
				type: "lab",
				value: {
					title: "New Laboratory",
					description: "Start Editing This Description...",
					parent_step_id: step_id,
					file_ids: [],
				},
			},
			thing_privileges: { read: "*", write: [-1] },
		});
	}

	return (
		<div style={{ padding: "12px" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<CustomTitle
					text={`Laboratories of step #${step_id}`}
					back_link={`/${step_id}`}
				></CustomTitle>
				<div>
					{active_prof_seed?.user_id === -1 && (
						<Button
							onClick={new_lab}
							style={{ display: "grid", placeItems: "center" }}
						>
							Add a new Laboratory
						</Button>
					)}
				</div>
			</div>
			{labs.map((lab) => (
				<Lab
					lab={lab as cache_item<lab_thing>}
					key={lab.thing_id}
				/>
			))}
		</div>
	);
};
