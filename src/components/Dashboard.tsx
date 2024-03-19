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
import { useCharacterStatus } from "../useCharacterStatus";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
import wallpaper from "/Users/hamedpro/wallpapers/blue_abstract_4.jpg";
import { InputText } from "primereact/inputtext";
export function Dashboard() {
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
		<>
			<div
				style={{
					background: `url(${wallpaper})`,
					width: "100vw",
					height: "100vh",
					zIndex: -1,
					position: "fixed",
					filter: "blur(32px)",
				}}
			></div>
			<div
				style={{
					padding: "32px",
					display: "flex",
					width: "92%",
					margin: "auto",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "100%",
					alignItems: "center",
					rowGap: "24px",
				}}
			>
				<div
					style={{
						width: "100%",
						padding: "35px",
						borderRadius: "8px",

						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						textAlign: "center",
						color: "var(--color1_primary)",
						background: "var(--color2_secondary)",
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
							className="bi bi-robot"
							style={{ fontSize: "55px" }}
						/>
					</div>
					<h1 style={{ marginBottom: "12px", marginTop: "0px" }}>WiseCrack</h1>
					<p>
						hit the mic and ask anything you want. for example some other text will be
						placed here.
					</p>
				</div>
				{messages.length === 0 ? (
					<div
						style={{
							flexWrap: "wrap",
							borderRadius: "8px",
							display: "flex",

							width: "100%",

							justifyContent: "space-between",
							rowGap: "12px",
						}}
					>
						{[
							["Navigation", "find promises node in javascript"],
							[
								"Exam Record",
								"I took a typescript typeguard system exam and scored 15%.",
							],
							["Ask anything", "explain me lesson 2 of math 11"],
							["Statistics", "show me last week statistics"],
						].map((item) => (
							<Button
								style={{
									flex: "0 0 calc(50% - 12px )",
									textAlign: "start",
									display: "flex",
									flexDirection: "column",
									alignItems: "start",
								}}
								key={JSON.stringify(item)}
								onClick={() => {
									set_prompt_input(item[1]);
								}}
							>
								<b style={{ margin: "4px 0px" }}>{item[0]}</b>

								<span style={{ color: "var(--color1_secondary)" }}>{item[1]}</span>
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
					style={{ width: "100%", position: "relative" }}
				>
					<InputText
						style={{
							borderRadius: "8px",
							resize: "none",

							height: "60px",
						}}
						value={prompt_input}
						onChange={(e) => set_prompt_input(e.target.value)}
					/>
					<Button
						style={{
							position: "absolute",
							right: "30px",

							top: "50%",

							zIndex: 1,
							transform: "translate(50% , -50% )",
						}}
						onClick={() => {
							set_messages((prev) => [...prev, ["user", prompt_input]]);
							submit_prompt_to_text_generative_model();
						}}
						rounded
						text
					>
						<i
							style={{ fontSize: "x-large" }}
							className="bi bi-send-check-fill"
						/>
					</Button>
				</div>
			</div>
		</>
	);
}
