import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { gql, useMutation } from "@apollo/client";
import { node } from "../../types";
import { useNavigate } from "react-router-dom";
export const NewNodeModal = ({ active, onHide }: { active: boolean; onHide: () => void }) => {
	var nav = useNavigate();
	var [addNode, { data }] = useMutation(gql`
		mutation add_new_query($title: String!, $description: String!) {
			addNode(title: $title, description: $description) {
				description
				title
				_id
			}
		}
	`);
	var [new_node, set_new_node] = useState<Pick<node, "title" | "description">>({
		title: "",
		description: "",
	});
	async function submit_new_step() {
		var new_node_id: string = (
			await addNode({
				variables: { title: new_node.title, description: new_node.description },
			})
		).data.addNode._id;
		nav(`/nodes/${new_node_id}`);
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
					value={new_node.title}
					onChange={(e) => {
						set_new_node((prev) => ({ ...prev, title: e.target.value }));
					}}
					style={{ width: "100%" }}
				/>

				<p>Description:</p>
				<InputTextarea
					value={new_node.description}
					onChange={(e) => {
						set_new_node((prev) => ({ ...prev, description: e.target.value }));
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
					disabled={!new_node["title"]}
				>
					Continue Creating
				</Button>
			</div>
		</Dialog>
	);
};
