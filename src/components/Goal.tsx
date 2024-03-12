import React, { useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { useCharacterStatus } from "../useCharacterStatus";
import { CustomMenu } from "./CustomMenu";
import { useCollection } from "../useCollection";
import { user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
export const Goal = () => {
	var nav = useNavigate();
	var character_status = useCharacterStatus();
	var { data: users } = useCollection<user>("users");
	if (users === undefined) return "'users' collection not available now";
	var user = users.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined) return "could not find your user data";

	if (typeof character_status === "string") return character_status;
	var { children, set_current_parent_id, current_parent_node } = character_status;
	if (user.goal === null || user.goal === undefined)
		return (
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<h1>You have no goal set</h1>
				<Button
					onClick={() => {
						nav("/goal/choosing");
					}}
				>
					start choosing a goal
				</Button>
			</div>
		);
	return (
		<>
			<div style={{ display: "flex", justifyContent: "center" }}></div>
			<CustomMenu {...character_status} />
		</>
	);
};
