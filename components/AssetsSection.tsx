import { Button } from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { useContext } from "react";

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
	return "AssetsSection is not converted yet";
	/* var { download_tar_archive, download_a_file, profiles_seed, configured_axios, cache } =
		useContext(context);
	var active_prof_seed = find_active_profile_seed(profiles_seed);
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
		onUpload(new_file_id);
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
						onClick={() => download_tar_archive(file_ids, tar_archive_name)}
					>
						Tar Archive
					</Button>
					{active_prof_seed?.user_id === -1 && (
						<div className="card flex justify-content-center">
							<FileUpload
								mode="basic"
								uploadHandler={uploadHandler}
								customUpload
								disabled={change_mode === false}
							/>
						</div>
					)}
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
						<b>
							{cache.find(
								(ci) =>
									ci.thing.type === "meta" && ci.thing.value.file_id === file_id
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
								icon="bi bi-trash2 pr-2"
							>
								<span className="hidden sm:inline-block">Delete</span>
							</Button>
						)}
					</div>
				))}
			</div>
		</div>
	); */
};
