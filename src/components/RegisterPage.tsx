import React, { useContext, useEffect } from "react";
import { Register } from "./Register";
import { CustomTitle } from "./CustomTitle";
import { context } from "freeflow-react";
export const RegisterPage = () => {
	return (
		<div style={{ padding: "12px" }}>
			<CustomTitle
				text="RegisterPage"
				back_link="/"
			/>
			<Register />
		</div>
	);
};
