import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const CustomTitle = ({
	back_link,
	text,
	children,
	back_onclick,
	style,
}: {
	back_link?: string;
	text: string;
	children?: ReactNode;
	back_onclick?: Function;
	style?: React.CSSProperties;
}) => {
	var nav = useNavigate();
	return (
		<div style={{ display: "flex", alignItems: "center", gap: "12px", ...style }}>
			<h1
				onClick={() => (back_onclick ? back_onclick() : nav(`${back_link}`))}
				className="bi bi-chevron-left cursor-pointer hover:bg-gray-200 hover:text-gray-700 hover:px-1 duration-200 rounded-lg"
			/>
			<h1>{text}</h1>
			{children}
		</div>
	);
};
