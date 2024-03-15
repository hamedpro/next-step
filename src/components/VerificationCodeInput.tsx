import { InputText } from "primereact/inputtext";
import React, { useState, useRef, useEffect } from "react";

interface VerificationCodeInputProps {
	length: number; // Number of verification code digits
	onChange: (code: string, clear_all: Function) => void; // Callback function for entered code
	placeholder?: string; // Optional placeholder text for input fields
	className?: string; // Optional class name for styling the component
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
	length,
	onChange,
	className = "",
}) => {
	// State and Refs
	const [code, setCode] = useState("-".repeat(length));
	const inputRefs = useRef(Array(length).fill(null));
	useEffect(() => {
		onChange(code, () => {
			setCode("-".repeat(length));
		});
	}, [JSON.stringify(code)]);
	// Input Change Handler
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setCode((prev) => {
			var clone = prev;
			clone =
				clone.slice(0, index) +
				(event.target.value === "" ? "-" : event.target.value) +
				clone.slice(index + 1);

			return clone;
		});

		if (event.target.value.length === 1 && index < length - 1) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle copy/paste (optional)
	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedCode = e.clipboardData.getData("text");
		if (pastedCode.length === length) {
			setCode(pastedCode);
		}
	};

	// Focus first input on mount
	useEffect(() => {
		for (var index = 0; index < length; index++) {
			inputRefs.current[index] = document.getElementById(`input_element_${index}`);
		}
		inputRefs.current[0].focus();
	}, []);

	return (
		<div
			className={`${className}`}
			style={{ display: "flex", gap: "10px", position: "relative", width: "100%" }}
		>
			{Array.from({ length }).map((_, index) => (
				<InputText
					key={index}
					type="text"
					maxLength={1}
					id={`input_element_${index}`}
					value={code[index] === "-" ? "" : code[index]}
					onChange={(e) => handleInputChange(e, index)}
					onPaste={handlePaste}
					className="verification_code_input"
				/>
			))}
		</div>
	);
};

export default VerificationCodeInput;
