import React, { useContext, useEffect } from "react";
import { Register } from "./Register";
import { CustomTitle } from "./CustomTitle";
import { context } from "freeflow-react";
export const RegisterPage = () => {
	var { profiles_seed } = useContext(context);
	useEffect(() => {
		console.log(profiles_seed);
	}, [profiles_seed]);
	return (
		<div style={{ padding: "8px" }}>
			<CustomTitle
				text="RegisterPage"
				back_link="/"
			/>
			<Register />
		</div>
	);
};
