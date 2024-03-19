import { useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthRoutesTemplate } from "./AuthRoutesTemplate";
import key_icon from "/Users/hamedpro/Downloads/3dicons-png-dynamic-1.0.0/png/key/key-dynamic-gradient.png";
import VerificationCodeInput from "./VerificationCodeInput";
import { Toast } from "primereact/toast";
import { custom_axios, useCollection } from "../useCollection";
import { user } from "../../types";
import { generateRandomString } from "../../helpers";

export const VerificationCodeInputPage = () => {
	var nav = useNavigate();
	var { data: users } = useCollection<user>("users");
	var toast = useRef(null);

	var [search_params] = useSearchParams();
	var verification_code = search_params.get("verification_code");
	var phone_number = search_params.get("phone_number");
	if (verification_code === null || phone_number === null) return "missing url param";
	if (users === undefined) return "'users' collection is not available";
	async function enter_user() {
		//if user is not registered => create user
		//finally => login

		var user = users!.find((user) => user.phone_number === phone_number);
		if (user === undefined) {
			//register user
			var new_user: Omit<user, "id"> = {
				phone_number: phone_number!,
				exam_records: [],
				username: generateRandomString(
					6,
					users!.map((user) => user.username)
				),
				biography: "",
			};
			try {
				var response = await custom_axios({
					url: `/collections/users`,
					method: "post",
					data: new_user,
				});
				var new_user_id: string = response.data.inserted_id;
				localStorage.setItem("user_id", new_user_id);
				nav("/auth/profile_init");
			} catch (error) {
				(toast.current! as Toast).show({
					severity: "error",
					summary: "Registration Error",
					detail: "i could not create your user profile. please try again later :(",
				});
			}
		} else {
			localStorage.setItem("user_id", user.id);
			nav("/auth/profile_init");
		}
	}
	return (
		<>
			<Toast ref={toast} />
			<AuthRoutesTemplate icon_url={key_icon}>
				<h1 style={{ color: "var(--color1_primary)", margin: "0px" }}>Verification Code</h1>
				<p style={{ color: "var(--color1_primary)", lineHeight: "1.5" }}>
					verification code was sent to <b>{phone_number}</b>
				</p>
				<br />
				<VerificationCodeInput
					length={4}
					onChange={(code, clear_all) => {
						if (!code.includes("-")) {
							if (code !== verification_code) {
								(toast.current! as Toast).show({
									severity: "error",
									summary: "Incorrect Code",
									detail: "Please Try Again",
								});
								clear_all();
							} else {
								(toast.current! as Toast).show({
									severity: "success",
									summary: "OK!",
									detail: "Your Authentication Was Done.",
								});
								enter_user();
							}
						}
					}}
				/>
				<br />

				<Link
					style={{ fontSize: "small" }}
					to="/auth/phone_number_input"
				>
					<i className="bi bi-phone" /> Edit Phone Number
				</Link>
			</AuthRoutesTemplate>
		</>
	);
};
