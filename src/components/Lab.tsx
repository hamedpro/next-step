import { cache_item } from "freeflow-core/dist/UnifiedHandler_types";
import React, { useContext, useEffect, useState } from "react";
import { lab_thing } from "../../types";
import ReactMarkdown from "react-markdown";
import { active_profile_seed_is_premium } from "../helpers";
import { context } from "freeflow-react";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { DataTable } from "primereact/datatable";

export const Lab = ({ lab }: { lab: cache_item<lab_thing> }) => {
	var {
		cache,
		profiles_seed,
		request_new_transaction,
		configured_axios,
		download_a_file,
		download_tar_archive,
	} = useContext(context);

	var premium_account = active_profile_seed_is_premium(cache, profiles_seed);
	var [new_lab, set_new_lab] = useState(lab.thing.value);
	var active_prof_seed = find_active_profile_seed(profiles_seed);
	useEffect(() => {
		set_new_lab((prev) => lab.thing.value);
	}, [JSON.stringify(lab.thing.value)]);

	var [markdown_edit_mode, set_markdown_edit_mode] = useState(false);
	async function apply_changes() {
		await request_new_transaction({
			thing_id: lab.thing_id,
			new_thing_creator: (prev) => ({
				...prev,
				value: new_lab,
			}),
		});
	}
	async function uploadHandler(e: FileUploadHandlerEvent) {
		var form = new FormData();
		var file = e.files[0];
		if (file === undefined) {
			alert("select a single file.");
			return;
		}
		form.append("file", file);
		var { new_file_id } = (
			await configured_axios({
				data: form,
				url: "/files",
				method: "post",
			})
		).data;
		set_new_lab((prev) => ({ ...prev, file_ids: prev.file_ids.concat(new_file_id) }));
		e.options.clear();
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
				{active_prof_seed?.user_id === -1 ? (
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
				) : (
					<h1 style={{ marginTop: "10px" }}>{new_lab["title"]}</h1>
				)}
				{active_prof_seed?.user_id === -1 && (
					<Button
						onClick={apply_changes}
						disabled={JSON.stringify(lab.thing.value) === JSON.stringify(new_lab)}
						icon="bi bi-floppy2-fill pr-2"
					>
						<span className="hidden sm:inline-block">Apply Changes</span>
					</Button>
				)}
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

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<h4>Uploaded Files:</h4>
					<div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
						<Button
							icon="bi bi-cloud-download pr-2"
							onClick={() =>
								download_tar_archive(
									lab.thing.value.file_ids,
									`step-${lab.thing.value.title}.tar`
								)
							}
						>
							Tar Archive
						</Button>
						<div className="card flex justify-content-center">
							<FileUpload
								mode="basic"
								uploadHandler={uploadHandler}
								customUpload
							/>
						</div>
					</div>
				</div>
				<hr style={{ backgroundColor: "gray", width: "100%" }} />
				<div>
					{new_lab["file_ids"].map((file_id) => (
						<div
							key={file_id}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								columnGap: "10px",
							}}
						>
							<b>#{file_id}</b>
							<b>
								{cache.find(
									(ci) =>
										ci.thing.type === "meta" &&
										ci.thing.value.file_id === file_id
								)?.thing.value.originalFilename || "name not unkown"}
							</b>
							<Button
								onClick={() => download_a_file(file_id)}
								icon="bi bi-cloud-download pr-2"
							>
								<span className="hidden sm:inline-block">Download</span>
							</Button>
							{active_prof_seed?.user_id === -1 && (
								<Button
									severity="danger"
									onClick={() => {
										if (
											window.confirm(
												"Are you sure you wanna UNLINK this file ?"
											) === false
										)
											return;
										set_new_lab((prev) => ({
											...prev,
											file_ids: prev.file_ids.filter((fi) => fi !== file_id),
										}));
									}}
									icon="bi bi-trash2 pr-2"
								>
									<span className="hidden sm:inline-block">Delete</span>
								</Button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
