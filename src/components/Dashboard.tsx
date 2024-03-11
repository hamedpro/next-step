import { custom_axios } from "../useCollection";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useRecording } from "../useRecording";
import { CustomMenu } from "./CustomMenu";
import { useCharacterStatus } from "../useCharacterStatus";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
export function AiAssistant() {
	var [messages, set_messages] = useState<["user" | "model", string][]>([]);
	function submit_prompt_to_text_generative_model() {
		custom_axios({
			url: "/models/inference/text_generative_model",
			data: {
				prompt: prompt_input,
			},
			method: "post",
		})
			.then(
				(response) => {
					set_messages((prev) => [...prev, ["model", response.data.result]]);
				},
				(error) => {
					alert("something went wrong when using text generative model");
				}
			)
			.finally(() => {
				set_prompt_input("");
			});
	}

	function on_recording_upload(asset_id: number) {
		custom_axios({
			url: "/models/inference/speech_to_text",
			method: "post",
			data: {
				asset_id: asset_id,
			},
		}).then(
			(response) => {
				set_prompt_input(response.data.text);
			},
			(error) => {
				alert('something went wrong in "speech to text" part');
			}
		);
	}
	useRecording({ custom_axios: custom_axios, on_upload: on_recording_upload });
	var [prompt_input, set_prompt_input] = useState("");
	return (
		<div
			style={{
				border: "1px solid aqua",
				borderRadius: "8px",
				padding: "24px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				height: "100%",
				alignItems: "center",
				rowGap: "24px",
			}}
		>
			<div
				style={{
					width: "95%",
					padding: "35px",
					borderRadius: "8px",
					border: "1px solid rgb(0 255 255 / 25%)",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					textAlign: "center",
				}}
			>
				<div
					style={{
						width: "100px",
						height: "100px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",

						padding: "20px",
						transition: "400ms",
						borderRadius: "100%",
					}}
					id="mic"
				>
					<i
						className="bi bi-mic"
						style={{ fontSize: "55px" }}
					/>
				</div>
				<h1 style={{ marginBottom: 0 }}>Your Virtual Assistant</h1>
				<p>
					hit the mic and ask anything you want. for example some other text will be
					placed here.
				</p>
			</div>
			{messages.length === 0 ? (
				<div
					style={{
						margin: "20px",
						border: "1px solid white",
						borderRadius: "8px",
						display: "flex",
						gap: "10px",
						padding: "10px",
					}}
				>
					{[
						["Navigation", "find promises node in javascript"],
						[
							"Exam Record",
							"I took a typescript typeguard system exam and scored 15%.",
						],
					].map((item) => (
						<Button
							key={JSON.stringify(item)}
							onClick={() => {
								set_prompt_input(item[1]);
							}}
						>
							<span>
								<b style={{ margin: "0px 4px" }}>{item[0]}</b>
								{item[1]}
							</span>
						</Button>
					))}
				</div>
			) : (
				<>
					{messages.map((message) => (
						<div key={JSON.stringify(message)}>
							<h1>{message[0]}</h1> said {message[1]}
						</div>
					))}
				</>
			)}
			<div
				className="p-inputgroup"
				style={{ width: "95%" }}
			>
				<InputTextarea
					rows={3}
					style={{
						borderRadius: "10px 0px 0px 10px",
						resize: "none",
					}}
					value={prompt_input}
					onChange={(e) => set_prompt_input(e.target.value)}
				/>
				<Button
					onClick={() => {
						set_messages((prev) => [...prev, ["user", prompt_input]]);
						submit_prompt_to_text_generative_model();
					}}
				>
					<i
						style={{ fontSize: "x-large" }}
						className="bi bi-send-check-fill"
					/>
				</Button>
			</div>
		</div>
	);
}
export const Dashboard = () => {
	var status = useCharacterStatus();
	if (typeof status === "string") return status;
	var { children, set_current_parent_id, current_parent_node, user } = status;
	return (
		<div style={{ display: "flex", columnGap: "30px", padding: "18px", flexDirection: "row" }}>
			<div style={{ display: "flex", width: "50%", flexDirection: "column" }}>
				<CustomMenu
					children={children}
					set_current_parent_id={set_current_parent_id}
					current_parent_node={current_parent_node}
				/>
			</div>
			<div
				style={{ display: "flex", width: "50%", flexDirection: "column", padding: "12px" }}
			>
				<AiAssistant />
			</div>
		</div>
	);
};
