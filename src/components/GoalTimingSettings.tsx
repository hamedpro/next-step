import { InputSwitch } from "primereact/inputswitch";
import { custom_axios, useCollection } from "../useCollection";
import { user } from "../../types";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { GoalInitSteps } from "./GoalInitSteps";
export const GoalTimingSettings = () => {
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
	return (
		<div>
			<h1>GoalTimingSettings</h1>
			<h2>You have 2 options: </h2>

			<InputSwitch
				checked={Boolean(user.goal_timing_mode && user.goal_timing_mode[0] === "static")}
				onChange={(e) => {
					if (e.value === false) {
						update_goal_timing_mode(null);
					} else {
						update_goal_timing_mode([
							"static",
							new Date().getTime() + 1000 * 3600 * 24 * 10,
						]);
					}
				}}
			/>
			<p>
				<b>static</b>You can specify a finish timestamp so each time you render a calendar,
				remained steps are divided into remaining days automatically
			</p>
			{Boolean(user.goal_timing_mode && user.goal_timing_mode[0] === "static") && (
				<>
					{" "}
					<Calendar
						value={new Date(user.goal_timing_mode![1])}
						onChange={(e) =>
							update_goal_timing_mode(["static", (e.target.value as Date).getTime()])
						}
						dateFormat="dd/mm/yy"
					/>
				</>
			)}
			<hr />
			<InputSwitch
				checked={Boolean(user.goal_timing_mode && user.goal_timing_mode[0] === "dynamic")}
				onChange={(e) => {
					if (e.value === false) {
						update_goal_timing_mode(null);
					} else {
						update_goal_timing_mode(["dynamic", 10]);
					}
				}}
			/>
			<p>
				<b>dynamic</b>You can specify how many steps you want to get done in each single
				day. so each time you render a calendar, it calculates how many days you need to
				complete your goal
			</p>
			{Boolean(user.goal_timing_mode && user.goal_timing_mode[0] === "dynamic") && (
				<>
					<InputNumber
						value={user.goal_timing_mode![1]}
						onValueChange={(e) => {
							if (typeof e.target.value !== "number")
								throw "value of target of this input number was supposed to be a number";
							update_goal_timing_mode(["dynamic", e.target.value]);
						}}
					/>
				</>
			)}
			<GoalInitSteps />
		</div>
	);
};
