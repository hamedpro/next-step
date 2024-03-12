import React, { useContext } from "react";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { custom_axios, useCollection } from "../useCollection";
export const Auth = () => {
	var nav = useNavigate();
	var { data: users } = useCollection<user>("users");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	var user = users?.find((user) => user.username === username);
	function login() {
		if (!user) {
			throw new Error("User not found");
		}
		if (user.password !== password) {
			alert("password incorrect");
		} else {
			localStorage.setItem("user_id", user.id);
			nav("/dashboard");
		}
	}
	async function register() {
		var new_user: Omit<user, "id"> = { username, password, exam_records: [] };

		var new_user_id: string = (
			await custom_axios({
				url: "/collections/users",
				method: "post",
				data: { value: new_user },
			})
		).data;
		localStorage.setItem("user_id", new_user_id);
		nav("/dashboard");
	}

	if (users === undefined) return "i dont have users yet.";
	return (
		<div>
			<h1>Auth</h1>
			<p>Username:</p>
			<InputText
				value={username}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					setUsername(event.target.value)
				}
			/>
			<p>Password:</p>
			<InputText
				type="password"
				value={password}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					setPassword(event.target.value)
				}
			/>
			{user ? (
				<Button onClick={login}>Login</Button>
			) : (
				<Button onClick={register}>Register</Button>
			)}
		</div>
	);
};
