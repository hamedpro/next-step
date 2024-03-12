import { useCollection } from "../useCollection";
import { node, step, user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { calc_user_skill_level, getTimestampsForNDays } from "../../helpers";
import { Calendar as PrimeReactCalendar } from "primereact/calendar";
import { useState } from "react";
export const Calendar = () => {
	var nav = useNavigate();

	/* timestamp of start of today */
	var [selected_day, set_selected_day] = useState<ReturnType<(typeof Date)["now"]>>(() => {
		var today_start = new Date();
		today_start.setHours(0, 0, 0, 0);
		//today_start.setDate(today_start.getDate() + 1);
		return today_start.getTime();
	});
	var { data: users } = useCollection<user>("users");
	var { data: nodes } = useCollection<node>("nodes");
	if (users === undefined) return "'users' collection is not available yet";
	if (nodes === undefined) return "'nodes' collection is not available yet";
	var user = users.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "could not find your user data";
	if (user.goal === undefined || user.goal === null)
		return (
			<div>
				<h1>You have to set your goal first</h1>
				<Button onClick={() => nav("/goal/choosing")}>Set a goal</Button>
			</div>
		);
	if (user.goal_timing_mode === undefined || user.goal_timing_mode === null)
		return (
			<div>
				<h1>You have a goal but you have not set goal timing settings.</h1>
				<Button onClick={() => nav("/goal/timing")}>Set a goal timing setting</Button>
			</div>
		);
	var steps_to_be_done: step[] = user.goal.map((goal_item) => [
		goal_item[0],
		calc_user_skill_level(user!, goal_item[0]),
		goal_item[1],
	]);

	var required_days_count: number;
	if (user.goal_timing_mode![0] === "dynamic") {
		required_days_count = Math.ceil(steps_to_be_done.length / user.goal_timing_mode![1]);
	} else {
		var i = 1;
		while (true) {
			if (getTimestampsForNDays(i).includes(user.goal_timing_mode![1])) {
				required_days_count = i;
				break;
			} else {
				i++;
			}
		}
	}

	var steps_count_in_each_day: number;
	if (user.goal_timing_mode![0] === "dynamic") {
		steps_count_in_each_day = user.goal_timing_mode![1];
	} else {
		Math.ceil(steps_to_be_done.length / required_days_count);
	}

	var plan_days: { [day_start_timestamp: number]: step[] } = {};
	getTimestampsForNDays(required_days_count).forEach((day_start_timestamp) => {
		plan_days[day_start_timestamp] = steps_to_be_done.splice(0, steps_count_in_each_day);
		//console.log(steps_to_be_done.length);
		//console.log(steps_count_in_each_day);
	});

	return (
		<div>
			<h1>Calendar</h1>
			<PrimeReactCalendar
				inline={true}
				onChange={(e) => {
					if (e.value instanceof Date === false)
						throw "e.value was supposed to be an instance of Date";
					set_selected_day((e.value as Date).getTime());
				}}
				value={new Date(selected_day)}
			/>
			<h1>Steps of selected day ({new Date(selected_day).toString()}): </h1>
			{plan_days[selected_day].map((step) => (
				<pre key={JSON.stringify(step)}>{JSON.stringify(step, undefined, 4)}</pre>
			))}
		</div>
	);
};
