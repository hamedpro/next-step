import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useContext, useEffect } from "react";
import { custom_axios } from "../useCollection";
import { download_a_file, download_assets_az_zip } from "../../helpers";

export const AssetsSection = ({
	file_ids,
	file_names,
	tar_archive_name = "download.tar",
	onDelete,
	onUpload,
	change_mode,
}: {
	file_names: string[];
	file_ids: number[];
	tar_archive_name: string;
	onDelete: (file_id: number) => void;
	onUpload: (file_id: number) => void;
	change_mode: boolean;
}) => {
	async function uploadHandler(e: FileUploadHandlerEvent) {
		var form = new FormData();

		if (e.files.length !== 1) {
			alert("exactly 1 file should be chosen");
			return;
		}
		var file = e.files[0];
		form.append("file", file);
		var { asset_id } = (
			await custom_axios({
				data: form,
				url: "/files",
				method: "post",
			})
		).data;
		onUpload(asset_id as number);
		e.options.clear();
	}
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h3>Assets: </h3>
				<div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
					<Button onClick={() => download_assets_az_zip(file_ids)}>
						<i
							className="bi bi-cloud-download"
							style={{ marginRight: "6px" }}
						/>{" "}
						Tar Archive
					</Button>

					<div className="card flex justify-content-center">
						<FileUpload
							mode="basic"
							uploadHandler={uploadHandler}
							customUpload
							disabled={change_mode === false}
						/>
					</div>
				</div>
			</div>
			<hr style={{ backgroundColor: "gray", width: "100%" }} />
			<div style={{ display: "flex", rowGap: "8px", flexDirection: "column" }}>
				{file_ids.map((file_id, index) => (
					<div
						key={file_id}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							columnGap: "10px",
						}}
					>
						<b style={{ whiteSpace: "nowrap", width: "200px", overflow: "scroll" }}>
							#{file_id}: {file_names[index]}
						</b>
						<div style={{ display: "flex", alignItems: "center", columnGap: "12px" }}>
							<Button
								size="small"
								onClick={() => download_a_file(file_id)}
							>
								<i
									className="bi bi-cloud-download pr-2"
									style={{ marginRight: "6px" }}
								/>
								<span className="hidden sm:inline-block">Download</span>
							</Button>

							<Button
								size="small"
								disabled={change_mode === false}
								severity="danger"
								onClick={() => {
									if (
										window.confirm(
											"Are you sure you wanna UNLINK this file ?"
										) === false
									)
										return;
									onDelete(file_id);
								}}
							>
								<i
									className="bi bi-trash2 pr-2"
									style={{ marginRight: "6px" }}
								/>
								<span className="hidden sm:inline-block">Delete</span>
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
