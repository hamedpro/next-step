import { cache_item, profile } from "freeflow-core/dist/UnifiedHandler_types";
import { find_active_profile } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { roadmap_thing, step } from "../../types";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
export const NewStepModal = ({
	state,
	roadmap,
}: {
	roadmap: cache_item<roadmap_thing>;
	state: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
	var [new_step, set_new_step] = useState<step>({
		title: "",
		description: "",
		weight: 1,
		resources: [],
		laboratory: null,
	});
	var freeflow_context = useContext(context);
	async function submit_new_step(layer_index: number) {
		var current_profile: profile | undefined = find_active_profile(freeflow_context.profiles);
		if (current_profile === undefined) {
			alert("there is not an active profile.");
			return;
		}
		await freeflow_context.request_new_transaction({
			new_thing_creator: (prev: roadmap_thing) => {
				prev.value.layers[layer_index].push(new_step);
			},
			thing_id: roadmap.thing_id,
			unresolved_cache: freeflow_context.unresolved_cache,
			jwt: current_profile.jwt,
			restful_api_endpoint: freeflow_context.rest_endpoint,
		});
	}
	return (
		<Dialog
			visible={state[0]}
			onHide={() => state[1](false)}
			header="New Step"
		>
			<p>Title:</p>
			<InputText
				value={new_step.title}
				onChange={(e) => {
					set_new_step((prev) => ({ ...prev, title: e.target.value }));
				}}
			/>

			<p>Description:</p>
			<InputText
				value={new_step.description}
				onChange={(e) => {
					set_new_step((prev) => ({ ...prev, description: e.target.value }));
				}}
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
		</Dialog>
	);
};
