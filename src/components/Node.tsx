import { MultiSelect } from "primereact/multiselect";
import { useContext, useEffect, useState } from "react";
import { node, user } from "../../types";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { CustomTitle } from "../components/CustomTitle";
import { CustomCard } from "../components/CustomCard";
import { AssetsSection } from "../components/AssetsSection";
import { CustomPanel } from "../components/CustomPanel";
import { useNavigate, useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { custom_axios, useCollection } from "../useCollection";
export const Node = () => {
	var { data: nodes, get_data } = useCollection<node>("nodes");
	var { data: users, get_data } = useCollection<user>("users");

	var { node_id } = useParams();
	var nav = useNavigate();
	var [change_mode, set_change_mode] = useState(false);
	var [new_node, set_new_node] = useState<node | undefined>(undefined);

	var node: node | undefined = nodes?.find((node: node) => node.id === node_id);
	useEffect(() => {
		if (node === undefined) return;
		set_new_node(node);
	}, [JSON.stringify(node)]);

	if (nodes === undefined) return "i dont have nodes yet.";
	if (node === undefined) return `404 - could not find a node with id === "${node_id}"`;

	var parent_id = node!.parent;
	var parent = nodes.find((pointer: node) => pointer.id === node_id);
	if (parent_id !== null && parent === undefined)
		return `404 - parnet_id is not null but could not find such a node (looking for a node with id = "${parent_id}")`;

	if (new_node === undefined)
		return "all required data is processed but new_node is not updated at this moment";
	var user: user | undefined = users?.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "you are logged in an account which doesnt exist at all ";
	async function save_changes() {
		await custom_axios({
			url: `/collections/nodes/${node_id}`,
			method: "put",
			data: new_node,
		});
		await get_data();
	}

	async function toggle_done_mark() {
		alert("Under development");
	}
	return (
		<div style={{ padding: "12px" }}>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<CustomTitle
					text={node.title}
					back_link={node.parent === null ? "/dashboard" : `/${node.parent}`}
				/>
				<div
					style={{ alignItems: "center", gap: "10px" }}
					className="hidden sm:flex"
				>
					<>
						<ToggleButton
							checked={change_mode}
							onChange={(e) => set_change_mode(e.value)}
							onLabel="Edit Mode On"
							offLabel="Editing Mode Off"
						/>
						<Button
							style={{ height: "fit-content" }}
							onClick={save_changes}
							disabled={JSON.stringify(node) === JSON.stringify(new_node)}
						>
							Save Changes
						</Button>
					</>
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<p style={{ marginTop: "20px" }}>Title:</p>
				{change_mode === true ? (
					<InputText
						value={new_node.title}
						onChange={(e) => {
							set_new_node((prev) => ({ ...prev!, title: e.target.value }));
						}}
						style={{ width: "100%" }}
					/>
				) : (
					<CustomCard>{new_node.title}</CustomCard>
				)}

				<p>Description:</p>
				{change_mode === true ? (
					<InputTextarea
						value={new_node.description}
						onChange={(e) => {
							set_new_node((prev) => ({ ...prev!, description: e.target.value }));
						}}
						rows={5}
						style={{ width: "100%" }}
					/>
				) : (
					<CustomCard>{new_node.description}</CustomCard>
				)}
			</div>
			<p>weight:</p>

			<Rating
				disabled={change_mode === false}
				style={{ marginBottom: "20px" }}
				value={new_node.weight}
				onChange={(e) =>
					set_new_node((prev) => {
						if (typeof e.value !== "number")
							throw "internal error. was sure e.value is a number because cancel prop is set to false";
						return { ...prev!, weight: e.value };
					})
				}
				cancel={false}
			/>
			<hr />
			<p>your skill level:</p>
			<Rating
				style={{ marginBottom: "20px" }}
				value={user.skill_set.find((item) => item[0] === node_id)?.[1] || 0}
				onChange={async (e) => {
					var new_skill_set = [
						...user!.skill_set.filter((item) => item[0] !== node_id),
						[node_id, e.value || 0],
					];
					var url = `/collections/users/${user?.id}`;
					console.log(url);
					await custom_axios({
						url,
						method: "put",
						data: { skill_set: new_skill_set },
					});
					get_data();
				}}
			/>
			{/* <CustomPanel
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
			*/}
			<AssetsSection
				change_mode={change_mode}
				tar_archive_name={"assets-of-" + new_node.title + ".tar"}
				file_ids={new_node.assets || []}
				onUpload={(new_file_id) =>
					set_new_node((prev) => ({
						...prev!,
						assets: (prev!.assets || []).concat(new_file_id),
					}))
				}
				onDelete={(file_id) =>
					set_new_node((prev) => ({
						...prev!,
						assets: (prev!.assets || []).filter((ass) => ass !== file_id),
					}))
				}
			/>

			<hr style={{ margin: "28px 0px" }} />
			<p style={{ marginTop: "24px" }}>Prerequisites </p>
			{change_mode === true ? (
				<MultiSelect
					options={nodes.map((node) => ({
						title: node.title,
						code: node.id,
					}))}
					value={new_node["prerequisites"].map((node_id) => ({
						title: nodes?.find((node) => node.id === node_id)?.title,
						code: node_id,
					}))}
					onChange={(e) =>
						set_new_node((prev) => ({
							...prev!,
							prerequisites: e.value.map(
								({ code, title }: { code: number; title: string }) => code
							),
						}))
					}
					optionLabel="title"
					style={{ color: "black" }}
				/>
			) : (
				new_node["prerequisites"].map((node_id) => (
					<Button
						key={node_id}
						onClick={() => nav(`/nodes/${node_id}`)}
					>
						{nodes?.find((node) => node.id === node_id)?.title}
					</Button>
				))
			)}
		</div>
	);
};
