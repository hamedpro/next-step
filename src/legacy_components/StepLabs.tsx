import { useContext } from "react";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { CustomTitle } from "../components/CustomTitle";
import { Lab } from "./Lab";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { lab } from "../../types";
export const StepLabs = () => {
	var { data, server_post_verb } = useContext(ServerSyncContext);

	var step_id = Number(useParams().thing_id);
	var step = data.find(([id, type, value]) => type === "step" && id === step_id);
	if (step === undefined) return `couldn't find a step with id = ${step_id}`;
	var labs = data.filter(
		([id, type, value]) => type === "lab" && value.parent_step_id === step_id
	) as [number, "lab", lab][];
	async function new_lab() {
		server_post_verb((prev, max_existing_id) => {
			prev.push([
				max_existing_id,
				"lab",
				{
					title: "New Laboratory",
					description: "Start Editing This Description...",
					parent_step_id: step_id,
					file_ids: [],
				},
			]);
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
					<Button
						onClick={new_lab}
						style={{ display: "grid", placeItems: "center" }}
					>
						Add a new Laboratory
					</Button>
				</div>
			</div>
			{labs.map((lab) => (
				<Lab
					lab={lab}
					key={lab[0]}
				/>
			))}
		</div>
	);
};
