import { MultiSelect } from "primereact/multiselect";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { custom_axios, useCollection } from "../useCollection";
import { avg, calc_user_skill_level, dateCustomStringRepr } from "../../helpers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GradientWallpaper } from "./GradientWallpaper";
import { LineChartWithAreaFill } from "./LineChartWithAreaFill";
import { CustomGraphviz } from "./CustomGraphviz";
function PrerequisitesSection({
	new_node,
	nodes,
	set_new_node,
}: {
	new_node: node;
	nodes: node[];
	set_new_node: Dispatch<SetStateAction<node>>;
}) {
	var [prerequisites_table_search_query, set_prerequisites_table_search_query] = useState("");
	var [prerequisites_table_show_all_mode, set_prerequisites_table_show_all_mode] =
		useState(false);
	return (
		<>
			<h3 style={{ marginTop: "24px" }}>Prerequisites</h3>
			<DataTable
				rows={8}
				paginator={true}
				value={(prerequisites_table_show_all_mode
					? nodes
					: nodes.filter((node) => new_node!["prerequisites"].includes(node.id))
				)
					.filter((node) => {
						if (prerequisites_table_search_query === "") return true;
						return JSON.stringify(node).includes(prerequisites_table_search_query);
					})
					.map((node) => {
						return {
							node_id: node.id,
							title: node.title,
						};
					})
					.sort((i) => (new_node!.prerequisites.includes(i.node_id) ? -1 : 1))}
				onSelectionChange={(e) =>
					set_new_node((prev) => ({
						...prev!,
						prerequisites: e.value.map((i) => i.node_id),
					}))
				}
				selectionMode={"multiple"}
				selection={new_node!["prerequisites"].map((i) => ({
					node_id: i,
					title: nodes!.find((node) => node.id === i)?.title,
				}))}
				header={
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<ToggleButton
							checked={prerequisites_table_show_all_mode}
							onChange={(e) => set_prerequisites_table_show_all_mode((prev) => !prev)}
							onLabel="Show all nodes"
							offLabel="Only prerequisites"
						/>
						<div className="p-input-icon-left">
							<i className="pi pi-search" />
							<InputText
								value={prerequisites_table_search_query}
								onChange={(e) =>
									set_prerequisites_table_search_query(e.target.value)
								}
								placeholder="Keyword Search"
							/>
						</div>
					</div>
				}
			>
				<Column
					selectionMode="multiple"
					headerStyle={{ width: "3rem" }}
				></Column>

				<Column
					header="Node Id"
					field="node_id"
				/>
				<Column
					header="Node Title"
					field="title"
				/>
			</DataTable>
		</>
	);
}
export const Node = () => {
	var { data: nodes, get_data: refresh_nodes } = useCollection<node>("nodes");
	var { data: users, get_data: refresh_users } = useCollection<user>("users");

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
		await refresh_nodes();
	}

	return (
		<div style={{ padding: "12px", color: "var(--color1_secondary)" }}>
			<GradientWallpaper />
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<CustomTitle
					text={node.title}
					back_link={node.parent === null ? "/dashboard" : `/nodes/${node.parent}`}
				/>
				<div style={{ alignItems: "center", columnGap: "12px", display: "flex" }}>
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
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<h3 style={{ marginTop: "20px" }}>Title:</h3>
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

				<h3>Description:</h3>
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
			<h3>weight:</h3>

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
			<div
				style={{
					display: "flex",
					width: "100%",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h3>Exam Records: </h3>
				<Button
					onClick={() => {
						custom_axios({
							url: `/collections/users/${localStorage.getItem("user_id")}`,
							method: "put",
							data: {
								...user!,
								exam_records: [
									...user!.exam_records,
									{
										node_id: node_id!,
										score: Number(window.prompt("enter your score")),
										time: new Date().getTime(),
									},
								],
							},
						})
							.then(
								(response) => {
									alert("done");
								},
								(error) => {
									alert("something went wrong");
								}
							)
							.then(() => refresh_users());
					}}
				>
					new +
				</Button>
			</div>
			<DataTable
				style={{ margin: "16px 0px" }}
				value={user!.exam_records.map((i, index) => ({ ...i, id: index }))}
				showGridlines
			>
				<Column
					field="id"
					header="Id"
				/>
				<Column
					field="time"
					header="Time"
					body={(node) => dateCustomStringRepr(new Date(node.time))}
				/>
				<Column
					field="score"
					header="Score"
					body={(item) => (
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								columnGap: "2px",
							}}
						>
							<b style={{ marginRight: "8px" }}> {item.score}</b> (
							<Rating
								style={{}}
								disabled
								cancel={false}
								value={item.score / 20}
							/>
							)
						</div>
					)}
				/>
			</DataTable>
			<div
				style={{
					display: "flex",
					backgroundColor: "var(--color1_secondary)",
					padding: "16px",
					margin: "16px 0px",
					columnGap: "16px",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
					<LineChartWithAreaFill
						data={user.exam_records
							.sort((e1, e2) => e1.time - e2.time)
							.map((i, index) => i.score)}
					/>
				</div>

				<div
					style={{
						width: "50%",
						margin: "16px 0px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
					id="node"
				>
					<p style={{ fontSize: "small", color: "var(--color2_primary)" }}>
						Your skill set level:{" "}
					</p>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							rowGap: "16px",
							margin: "16px",
						}}
					>
						<h1
							style={{
								fontSize: "38px",
								color: "var(--color1_primary)",
								margin: "0px",
							}}
						>
							{user.exam_records.length === 0
								? 0
								: Math.round(avg(user.exam_records.map((record) => record.score)))}
						</h1>
						<Rating
							style={{ marginBottom: "20px", fontSize: "40px" }}
							value={calc_user_skill_level(user, node.id)}
							disabled={true}
							cancel={false}
						/>
					</div>
				</div>
			</div>

			<AssetsSection
				change_mode={change_mode}
				tar_archive_name={"assets-of-" + new_node.title + ".tar"}
				file_ids={new_node.assets.map((asset) => asset.file_id)}
				file_names={new_node.assets.map((asset) => asset.title)}
				onUpload={(new_file_id) =>
					set_new_node((prev) => ({
						...prev!,
						assets: (prev!.assets || []).concat({
							title: window.prompt("enter a title for this new asset") || "no title",
							file_id: new_file_id,
						}),
					}))
				}
				onDelete={(file_id) =>
					set_new_node((prev) => ({
						...prev!,
						assets: (prev!.assets || []).filter((ass) => ass.file_id !== file_id),
					}))
				}
			/>

			<hr style={{ margin: "16px 0px" }} />
			<PrerequisitesSection
				set_new_node={set_new_node as Dispatch<SetStateAction<node>>}
				new_node={new_node}
				nodes={nodes}
			/>
			<div
				style={{
					marginTop: "16px",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CustomGraphviz
					width_vw={97}
					height_vh={40}
					included_nodes={nodes.filter((i) =>
						[...new_node!.prerequisites, new_node!.id].includes(i.id)
					)}
				/>
			</div>
		</div>
	);
};
