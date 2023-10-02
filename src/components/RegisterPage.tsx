import { Register } from "./Register";
import { CustomTitle } from "./CustomTitle";
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
