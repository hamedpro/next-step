import React from "react";
import { custom_axios, useCollection } from "../useCollection";
import { node, user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { GoalInitSteps } from "./GoalInitSteps";

export const GoalChoosing = () => {
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
		})
			.then(
				(response) => {
					alert("done!");
				},
				(error) => {
					alert("something went wrong" + JSON.stringify(error, undefined, 4));
				}
			)
			.finally(refresh_users);
	}
	function reset_my_goal() {
		custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				goal: null,
			},
		})
			.then(
				(res) => alert("done."),
				(error) => alert("something went wrong" + JSON.stringify(error, undefined, 4))
			)
			.finally(refresh_users);
	}
	return (
		<div>
			<h1>GoalChoosing</h1>
			{user.goal === undefined || user.goal === null ? (
				<div>
					<h1>Choosing From A Preset</h1>
					<div style={{ border: "1px solid white", width: "100%" }}>
						<h1>All 5 stars</h1>
						<p>Set All Skill Levels</p>
						<Button onClick={set_all_5_stars}>select this</Button>
					</div>
				</div>
			) : (
				<div>
					<h1>You have a goal set </h1>
					<h1>Your goal: </h1>
					<Button onClick={reset_my_goal}>Reset My Goal</Button>
					<pre>{JSON.stringify(user.goal, undefined, 4)}</pre>
				</div>
			)}
			<GoalInitSteps />
		</div>
	);
};
