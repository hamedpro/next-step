import React, { useState } from "react";
import { custom_axios, useCollection } from "../useCollection";
import { node, user } from "../../types";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { GoalInitSteps } from "./GoalInitSteps";
import { GradientWallpaper } from "./GradientWallpaper";
import { CustomTitle } from "./CustomTitle";
import { defaults as chartjs_defaults } from "chart.js";
import { Chart } from "primereact/chart";
import { goal_progress } from "../../helpers";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
chartjs_defaults.plugins.legend.display = false;
export const GoalChoosing = () => {
	var [only_users_with_more_overall_progress, set_only_users_with_more_overall_progress] =
		useState(false);
	var [user_table_search_query, set_user_table_search_query] = useState("");
	var [mode, set_mode] = useState<"choose_from_presets" | "customized" | "follow_someone">(
		"choose_from_presets"
	);
	var nav = useNavigate();
	var { data: users, get_data: refresh_users } = useCollection<user>("users");
	var { data: nodes } = useCollection<node>("nodes");
	if (nodes === undefined) return "'nodes' collection is not available yet";
	if (users === undefined) return "'users' collection is not available yet";
	var user = users.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "could not find your user data";
	function set_all_5_stars() {
		custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				goal: nodes!.map((node) => [node.id, 5]),
			},
		}).then(
			(response) => {
				alert("done!");
				nav("/goal/timing");
			},
			(error) => {
				alert("something went wrong" + JSON.stringify(error, undefined, 4));
				refresh_users();
			}
		);
	}
	function set_empty_goal() {
		custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				goal: [],
			},
		}).then(
			(response) => {
				alert("done!");
				nav("/goal/timing");
			},
			(error) => {
				alert("something went wrong" + JSON.stringify(error, undefined, 4));
				refresh_users();
			}
		);
	}
	function follow_someone(user_id: user["id"]) {
		custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				goal: user_id,
			},
		}).then(
			(response) => {
				alert("done!");
				nav("/goal/timing");
			},
			(error) => {
				alert("something went wrong" + JSON.stringify(error, undefined, 4));
				refresh_users();
			}
		);
	}
	return (
		<>
			<div
				style={{
					backgroundColor: "aqua",
					height: "100vh",
					width: "100vw",
					position: "fixed",
					zIndex: -1,
				}}
			/>
			<div
				style={{
					padding: "16px 40px",
					color: "var(--color1_primary)",
					width: "100vw",
					display: "flex",
					flexDirection: "column",
					rowGap: "12px",
				}}
			>
				<CustomTitle
					back_link="/dashboard"
					text="Goal Choosing Stage"
				/>
				<b>Choose a mode:</b>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "100%",
						justifyContent: "space-between",
						columnGap: "12px",
					}}
				>
					{[
						[
							"bi bi-bricks",
							"Presets",
							"Choose from existing presets",
							"choose_from_presets",
						],
						[
							"bi bi-crosshair2",
							"Customized",
							"Customize a node down to details",
							"customized",
						],
						[
							"bi bi-person-arms-up",
							"Live Following",
							"Follow realtime status of someone else",
							"follow_someone",
						],
					].map((i) => (
						<Button
							key={JSON.stringify(i)}
							outlined={mode !== i[3]}
							style={{
								flex: "1",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								textAlign: "center",
								padding: "10px",
								height: "auto",
							}}
							onClick={() =>
								set_mode(
									i[3] as "customized" | "choose_from_presets" | "follow_someone"
								)
							}
						>
							<i
								className={i[0]}
								style={{ fontSize: "28px" }}
							/>
							<h3 style={{ margin: "10px" }}>{i[1]}</h3>
							<p style={{ fontSize: "small", marginTop: "2px" }}>{i[2]}</p>
						</Button>
					))}
				</div>
				<br />
				{mode === "choose_from_presets" && (
					<>
						<b>Presets:</b>
						<div
							style={{
								border: "1px solid var(--color2_secondary)",
								width: "100%",
								borderRadius: "8px",
								overflow: "hidden",
								backgroundColor: "#6366F1",
								color: "whitesmoke",
							}}
						>
							<div style={{ display: "flex", width: "100%", padding: "12px 16px" }}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										width: "270px",
									}}
								>
									<h1 style={{ marginBottom: "0px" }}>Perfection</h1>
									<p>
										set your target to 5 stars for each single node in the
										network. this way you are the very first perfect human!
									</p>
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										width: "0px",
										borderRight: "1px solid lightslategrey",
									}}
								></div>

								<div
									style={{
										padding: "12px",
										width: "100%",
										height: "50%",
										display: "flex",
										alignItems: "center",
										columnGap: "12px",
									}}
								>
									<Chart
										type="doughnut"
										data={{
											labels: ["remained", "done"],
											datasets: [
												{
													data: [
														goal_progress(
															user.exam_records,
															nodes.map((i) => [i.id, 5])
														).remained_step_units,
														goal_progress(
															user.exam_records,
															nodes.map((i) => [i.id, 5])
														).done_step_units,
													],
													backgroundColor: ["blue", "green"],
												},
											],
										}}
										options={{
											plugins: {
												doughnut: {
													legend: {
														display: false,
													},
												},
											},
											borderWidth: 0,
											cutout: "70%",
										}}
										style={{ height: "70px", width: "70px" }}
									/>
									<div>
										<h3 style={{ margin: "12px 0px 0px 0px" }}>
											Remaining Steps (
											<span>
												{Math.round(
													(goal_progress(
														user.exam_records,
														nodes.map((i) => [i.id, 5])
													).remained_step_units /
														(goal_progress(
															user.exam_records,
															nodes.map((i) => [i.id, 5])
														).remained_step_units +
															goal_progress(
																user.exam_records,
																nodes.map((i) => [i.id, 5])
															).done_step_units)) *
														100
												)}
												%
											</span>
											)
										</h3>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												textDecoration: "underline",
												textUnderlineOffset: "2px",
											}}
										>
											<p>
												<i
													className="bi bi-calculator"
													style={{ marginRight: "6px" }}
												/>
												{
													goal_progress(
														user.exam_records,
														nodes.map((i) => [i.id, 5])
													).remained_step_units
												}{" "}
												step units left
											</p>
										</div>
									</div>
								</div>
							</div>
							<div
								style={{
									width: "100%",
									height: "60px",
									display: "flex",
									justifyContent: "end",
									padding: "8px",
									backgroundColor: "white",
								}}
							>
								<Button onClick={set_all_5_stars}>
									Select Preset
									<i
										className="bi bi-chevron-right"
										style={{ marginLeft: "6px" }}
									/>
								</Button>
							</div>
						</div>
					</>
				)}
				{mode === "customized" && (
					<div
						style={{
							width: "100%",
							backgroundColor: "rgb(99, 102, 241)",
							display: "flex",
							padding: "16px",
							borderRadius: "8px",
							color: "white",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							<h1 style={{ margin: "14px 0px 0px 0px", display: "inline" }}>
								<i className="bi bi-crosshair2" /> Fully customized goal
							</h1>
							<span style={{ lineHeight: "50px", fontSize: "16px 24px" }}>
								this way you create a new empty goal which later on you can
								customize its skills in <Link to="/goal" />
							</span>
						</div>
						<Button
							onClick={set_empty_goal}
							outlined
							style={{ color: "white" }}
						>
							Continue
							<i
								className="bi bi-chevron-right"
								style={{ marginLeft: "6px" }}
							/>
						</Button>
					</div>
				)}
				{mode === "follow_someone" && (
					<DataTable
						value={users

							.filter((user) => user.id !== window.localStorage.getItem("user_id"))
							.filter(
								(other_user) =>
									goal_progress(
										other_user.exam_records,
										nodes!.map((node) => [node.id, 5])
									).done_rounded_percentage >
									goal_progress(
										user!.exam_records,
										nodes!.map((node) => [node.id, 5])
									).done_rounded_percentage
							)}
						header={
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<div className="p-input-icon-left">
									<i className="pi pi-search" />
									<InputText
										value={user_table_search_query}
										onChange={(e) =>
											set_user_table_search_query(e.target.value)
										}
										placeholder="Keyword Search"
									/>
								</div>
								<ToggleButton
									onChange={(e) =>
										set_only_users_with_more_overall_progress((prev) => !prev)
									}
									checked={only_users_with_more_overall_progress}
									onLabel="only users with more overall progress"
									offLabel="show all"
								/>
							</div>
						}
					>
						<Column
							header="User Id"
							field="id"
						/>
						<Column
							header="Username"
							field="username"
						/>
						<Column
							header="Actions"
							body={(item) => (
								<Button onClick={() => follow_someone(item.id)}>Select</Button>
							)}
						/>
					</DataTable>
				)}
				<GoalInitSteps />
			</div>
		</>
	);
};
