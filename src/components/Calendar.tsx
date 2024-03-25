import { useCollection } from "../useCollection";
import { node, step, user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import {
	calc_steps_to_be_done,
	calc_user_skill_level,
	getTimestampsForNDays,
	goal_timing_helper,
	user_skill_as_goal_specifier,
} from "../../helpers";
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

	if (typeof user.goal === "string") {
		var exam_records = users.find((i) => i.id === user!.goal)?.exam_records;
		if (exam_records === undefined)
			throw new Error("could not find the user you live follow as your goal");

		var goal_specifier = user_skill_as_goal_specifier(exam_records);
	} else {
		var goal_specifier = user.goal;
	}

	if (user.goal_timing_mode === undefined || user.goal_timing_mode === null)
		return (
			<div>
				<h1>You have a goal but you have not set goal timing settings.</h1>
				<Button onClick={() => nav("/goal/timing")}>Set a goal timing setting</Button>
			</div>
		);

	var steps_to_be_done = calc_steps_to_be_done(user.exam_records, goal_specifier);
	var { steps_count_in_each_day, required_days_count, plan_days } = goal_timing_helper(
		user.exam_records,
		goal_specifier,
		user.goal_timing_mode
	);

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
