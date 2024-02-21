import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useContext } from "react";
import { custom_axios } from "../useCollection";
import { download_a_file } from "../../helpers";

export const AssetsSection = ({
	file_ids,
	tar_archive_name = "download.tar",
	onDelete,
	onUpload,
	change_mode,
}: {
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
		var { new_file_id } = (
			await custom_axios({
				data: form,
				url: "/files",
				method: "post",
			})
		).data;
		onUpload(new_file_id as number);
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
				<h4>Assets: </h4>
				<div style={{ display: "flex", alignItems: "center", columnGap: "10px" }}>
					<Button
						icon="bi bi-cloud-download pr-2"
						onClick={() => alert("this feature is under development")}
					>
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
			<div>
				{file_ids.map((file_id) => (
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

						<Button
							onClick={() => download_a_file(file_id)}
							icon="bi bi-cloud-download pr-2"
						>
							<span className="hidden sm:inline-block">Download</span>
						</Button>

						<Button
							disabled={change_mode === false}
							severity="danger"
							onClick={() => {
								if (
									window.confirm("Are you sure you wanna UNLINK this file ?") ===
									false
								)
									return;
								onDelete(file_id);
							}}
							icon="bi bi-trash2 pr-2"
						>
							<span className="hidden sm:inline-block">Delete</span>
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
