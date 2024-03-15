import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import mobile_dynamic_gradient from "/Users/hamedpro/Downloads/3dicons-png-dynamic-1.0.0/png/mobile/mobile-dynamic-gradient.png";
import { AuthRoutesTemplate } from "./AuthRoutesTemplate";
import { generate_random_string_only_numbers, insertSpacesAtIndices } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { generateRandomString } from "../../helpers";
export const PhoneNumberInputPage = () => {
	var nav = useNavigate();
	var [phone_number, set_mobile_number] = useState<string>("");

	var isValidIranianPhoneNumber: boolean;
	// Regular expression for Iranian mobile phone numbers
	const iranianMobilePattern = /^09\d{9}$/;

	// Check if the string matches the pattern
	isValidIranianPhoneNumber = iranianMobilePattern.test(phone_number);

	return (
		<AuthRoutesTemplate icon_url={mobile_dynamic_gradient}>
			<h2 style={{ color: "var(--color1_primary)", margin: "0px" }}>Login or Register</h2>
			<p style={{ color: "var(--color1_primary)" }}>
				enter your phone number to get into Next Step:{" "}
			</p>
			<br />
			<div style={{ display: "flex", columnGap: "12px" }}>
				<InputText
					placeholder="09123456789"
					style={{ border: "1px solid var(--color2_secondary)" }}
					value={insertSpacesAtIndices(phone_number, [4, 7])}
					onChange={(e) => set_mobile_number(e.target.value.replaceAll(" ", ""))}
				/>
				<Button
					disabled={isValidIranianPhoneNumber === false}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",

						backgroundColor: isValidIranianPhoneNumber
							? "var(--color2_primary)"
							: "var(--color2_secondary)",
						...(isValidIranianPhoneNumber ? { color: "white" } : {}),
					}}
					outlined
					onClick={() => {
						nav(
							`/auth/verification_code_input?verification_code=${generate_random_string_only_numbers(
								4
							)}&phone_number=${phone_number}`
						);
					}}
				>
					<i className="bi bi-chevron-right" />
				</Button>
			</div>
		</AuthRoutesTemplate>
	);
};
