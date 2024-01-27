import React, { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const CustomLink = ({
	icon,
	text,
	url,
	style,
}: {
	icon: ReactNode;
	text: string;
	url?: string;
	style?: CSSProperties;
}) => {
	var nav = useNavigate();
	return (
		<p
			className="hover:bg-gray-200 hover:text-black duration-200"
			onClick={() => {
				if (url) {
					if (url.startsWith("http")) {
						window.location.assign(url);
					} else {
						nav(url);
					}
				}
			}}
			style={{
				display: "flex",
				alignItems: "center",
				cursor: "pointer",
				margin: "8px 0px",
				padding: "4px 4px",
				width: "fit-content",
				...style,
			}}
		>
			{icon} <span style={{ padding: "0px 8px" }}>{text}</span>
		</p>
	);
};
