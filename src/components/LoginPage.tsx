import React from "react";
import { Login } from "./Login";
import { CustomTitle } from "./CustomTitle";

export const LoginPage = () => {
	return (
		<div style={{ padding: "8px" }}>
			<CustomTitle
				text="Login Into Your Account"
				back_link=""
			/>
			<Login />
		</div>
	);
};
