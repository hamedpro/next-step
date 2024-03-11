import axios from "axios";
import { useEffect, useRef } from "react";

export function useRecording({
	custom_axios,
	on_upload,
}: {
	custom_axios: ReturnType<typeof axios.create>;
	on_upload?: (asset_id: number) => void;
}) {
	// in order to use this hook you need to have an element with id equal to "mic"
	// when you click on it if its not recording it starts recording
	// and on second click it stops recording
	const chunks = useRef<Blob[]>([]);
	const is_recording = useRef<boolean>(false);
	var on_upload_ref = useRef(on_upload);
	on_upload_ref.current = on_upload;
	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream: any) => {
			const mediaRecorder = new MediaRecorder(stream);
			document.getElementById("mic")!.onclick = function () {
				if (is_recording.current === false) {
					mediaRecorder.start();
					is_recording.current = true;
					//console.log("started recording");
				} else {
					mediaRecorder.stop();
					is_recording.current = false;
					//console.log("stopped recording");
				}
			};

			mediaRecorder.onstop = function (e: any) {
				const blob = new Blob(chunks.current, { type: mediaRecorder.mimeType });
				chunks.current = [];

				const file = new File([blob], "hamed.wav");
				var form = new FormData();
				form.append("file", file);
				var audio_url = URL.createObjectURL(blob);

				//console.log("url of recorded audio is ", audio_url);

				custom_axios({
					url: "/files",
					data: form,
					headers: {
						"Content-Type": "multipart/form-data",
					},
					method: "post",
				}).then(
					(response) => {
						if (on_upload_ref.current) {
							on_upload_ref.current(response.data.asset_id);
						}
					},

					(error) => {
						console.log("could not upload the file");
					}
				);
			};

			mediaRecorder.ondataavailable = function (e) {
				chunks.current.push(e.data);
			};
		});
	}, []);
}
