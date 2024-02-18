import React, { useContext } from "react";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { user } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
export const Auth = () => {
	var nav = useNavigate();
	var { data, server_post_verb, set_virtual_localstorage } = useContext(ServerSyncContext);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	var user = data.find(([id, type, value]) => value.username === username && type === "user") as
		| [number, "user", user]
		| undefined;
	function login() {
		if (!user) {
			throw new Error("User not found");
		}
		if (user[2].password !== password) {
			alert("password incorrect");
		} else {
			set_virtual_localstorage(JSON.stringify({ active_username: user[2].username }));
			nav("/");
		}
	}
	function register() {
		server_post_verb((prev, max_existing_id) => {
			var new_user: user = { username, password };
			prev.push([max_existing_id + 1, "user", new_user]);
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
			{user ? (
				<Button onClick={login}>Login</Button>
			) : (
				<Button onClick={register}>Register</Button>
			)}
		</div>
	);
};
