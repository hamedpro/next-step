import { InputSwitch } from "primereact/inputswitch";
import { custom_axios, useCollection } from "../useCollection";
import { user } from "../../types";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { GoalInitSteps } from "./GoalInitSteps";
import { Button } from "primereact/button";
import { useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { useNavigate } from "react-router-dom";
export const GoalTimingSettings = () => {
	var nav = useNavigate();
	var { data: users, get_data: refresh_users } = useCollection<user>("users");

	if (users === undefined) return "'users' collection not available yet";
	var user = users!.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "could not find your user data";

	function update_goal_timing_mode(new_goal_timing_mode: user["goal_timing_mode"]) {
		custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				goal_timing_mode: new_goal_timing_mode,
			},
		})
			.then(
				(res) => console.log("done"),
				(error) => alert("something went wrong")
			)
			.finally(refresh_users);
	}
	//console.log(user.goal_timing_mode);
	return (
		<>
			<div
				style={{
					height: "100vh",
					width: "100vw",
					backgroundColor: "aqua",
					zIndex: -1,
					position: "fixed",
				}}
			></div>
			<div
				style={{
					height: "100vh",
					width: "100vw",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						rowGap: "18px",
						width: "80%",
						color: "var(--color1_primary)",
					}}
				>
					<div
						style={{
							width: "100%",
							justifyContent: "space-between",
							alignItems: "center",
							display: "flex",
						}}
					>
						<CustomTitle
							back_link="/goal/choosing"
							text="Goal Timing Settings"
						/>
						<Button onClick={() => nav(`/goal`)}>Continue</Button>
					</div>
					<div id="goal_timing_settings_grid_container">
						<Button
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "start",
								alignItems: "start",
							}}
							outlined={
								!Boolean(
									user.goal_timing_mode && user.goal_timing_mode[0] === "dynamic"
								)
							}
							id="side1"
							onClick={(e) => {
								update_goal_timing_mode(["dynamic", 10]);
							}}
						>
							<h3>dynamic</h3>
						</Button>

						<Button
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "start",
								alignItems: "start",
							}}
							outlined={
								!Boolean(
									user.goal_timing_mode && user.goal_timing_mode[0] === "static"
								)
							}
							id="side2"
							onClick={(e) => {
								var last_day = new Date();
								last_day.setHours(0, 0, 0, 0);
								last_day.setDate(last_day.getDate() + 10);
								update_goal_timing_mode(["static", last_day.getTime()]);
							}}
						>
							<h3>static</h3>
						</Button>

						<div id="main">
							{Boolean(
								user.goal_timing_mode && user.goal_timing_mode[0] === "static"
							) && (
								<>
									<h1 style={{ margin: "0px" }}>
										<i
											style={{ fontSize: "26px", marginRight: "8px" }}
											className="bi bi-calendar3-event"
										/>
										A Static Goal
									</h1>
									<p>
										You can specify a finish timestamp so each time you render a
										calendar, remained steps are divided into remaining days
										automatically
									</p>
									<Calendar
										value={new Date(user.goal_timing_mode![1])}
										onChange={(e) =>
											update_goal_timing_mode([
												"static",
												(e.target.value as Date).getTime(),
											])
										}
										dateFormat="dd/mm/yy"
									/>
								</>
							)}
							{Boolean(
								user.goal_timing_mode && user.goal_timing_mode[0] === "dynamic"
							) && (
								<>
									<h1 style={{ margin: "0px" }}>
										<i
											style={{ fontSize: "26px", marginRight: "8px" }}
											className="bi bi-calendar3"
										/>
										A Dynamic Goal
									</h1>
									<p>
										You can specify how many steps you want to get done in each
										single day. so each time you render a calendar, it
										calculates how many days you need to complete your goal
									</p>
									<InputNumber
										value={user.goal_timing_mode![1]}
										onChange={(e) => {
											if (typeof e.value !== "number")
												throw "value of target of this input number was supposed to be a number";
											update_goal_timing_mode(["dynamic", e.value]);
										}}
									/>
								</>
							)}
						</div>
					</div>
					<GoalInitSteps />
				</div>
			</div>
		</>
	);
};
