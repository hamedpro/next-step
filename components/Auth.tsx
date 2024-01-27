import React, { useContext } from "react";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { user } from "../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
export const Auth = () => {
	var nav = useNavigate();
	var { data, server_post_verb, set_virtual_localstorage } = useContext(ServerSyncContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function login() {
		var user = data.users.find((user: user) => user.username === username);
		if (!user) {
			throw new Error("User not found");
		}
		if (user.password !== password) {
			alert("password incorrect");
		} else {
			set_virtual_localstorage(JSON.stringify({ active_username: user.username }));
			nav("/");
		}
	}
	function register() {
		server_post_verb((prev) => {
			prev.users.push({ username, password });
		});
		set_virtual_localstorage(JSON.stringify({ active_username: username }));
		nav("/");
	}
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
			{data.users.find((user: user) => user.username === username) ? (
				<Button onClick={login}>Login</Button>
			) : (
				<Button onClick={register}>Register</Button>
			)}
		</div>
	);
};
