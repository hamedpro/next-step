import { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { AssetsSection } from "../components/AssetsSection";
import { lab } from "../../types";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";

export const Lab = ({ lab }: { lab: [number, "lab", lab] }) => {
	var { data, server_post_verb } = useContext(ServerSyncContext);

	var [new_lab, set_new_lab] = useState(lab[2]);
	useEffect(() => {
		set_new_lab(() => lab[2]);
	}, [JSON.stringify(lab[2])]);

	var [markdown_edit_mode, set_markdown_edit_mode] = useState(false);

	async function apply_changes() {
		server_post_verb((prev) => {
			var pointer = prev.find(([id, type, value]) => id === lab[0]);
			if (!pointer) {
				throw new Error("lab not found");
			}
			pointer[2] = new_lab;
		});
	}

	return (
		<div
			style={{
				border: "1px solid gray",
				borderRadius: "8px",
				padding: "12px",
				margin: "10px 0px",
				rowGap: "20px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						columnGap: "10px",
						alignItems: "center",
					}}
				>
					<h4>title: </h4>
					<InputText
						value={new_lab["title"]}
						onChange={(e) =>
							set_new_lab((prev) => ({ ...prev, title: e.target.value }))
						}
					/>
				</div>
				<Button
					onClick={apply_changes}
					disabled={JSON.stringify(lab[2]) === JSON.stringify(new_lab)}
					icon="bi bi-floppy2-fill pr-2"
				>
					<span className="hidden sm:inline-block">Apply Changes</span>
				</Button>
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					rowGap: "10px",
				}}
			>
				<div
					style={{
						display: "flex",
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<h4>Description: </h4>
					<ToggleButton
						checked={markdown_edit_mode}
						onChange={(e) => set_markdown_edit_mode(e.target.value)}
						onLabel="Markdown Edit on"
						offLabel="Markdown Edit off"
					/>
				</div>
				{markdown_edit_mode ? (
					<InputTextarea
						style={{ width: "100%" }}
						value={new_lab["description"]}
						onChange={(e) =>
							set_new_lab((prev) => ({ ...prev, description: e.target.value }))
						}
					/>
				) : (
					<div
						style={{
							width: "100%",
							border: "1px solid gray",
							borderRadius: "8px",
							padding: "12px",
						}}
					>
						<ReactMarkdown children={new_lab["description"]} />
					</div>
				)}
			</div>
			<AssetsSection
				change_mode={true}
				onUpload={(new_file_id) => {
					set_new_lab((prev) => ({
						...prev,
						file_ids: prev.file_ids.concat(new_file_id),
					}));
				}}
				file_ids={new_lab.file_ids}
				tar_archive_name={`step-${new_lab.title}.tar`}
				onDelete={(file_id) =>
					set_new_lab((prev) => ({
						...prev,
						file_ids: prev.file_ids.filter((fi) => fi !== file_id),
					}))
				}
			/>
		</div>
	);
};
