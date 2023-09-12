import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const CustomTitle = ({
	back_link,
	text,
	children,
}: {
	back_link: string;
	text: string;
	children?: ReactNode;
}) => {
	var nav = useNavigate();
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
			<h1
				onClick={() => nav(`${back_link}`)}
				className="bi bi-chevron-left cursor-pointer hover:bg-gray-200 hover:text-gray-700 hover:px-1 duration-200 rounded-lg"
			/>
			<h1>{text}</h1>
			{children}
		</div>
	);
};
