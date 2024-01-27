import { Panel } from "primereact/panel";
import { ReactNode } from "react";

export const CustomPanel = ({
	children,
	bootstrap_icon,
	panel_title,
	icon_title,
}: {
	children?: ReactNode;
	bootstrap_icon: string;
	panel_title: string;
	icon_title: string;
}) => {
	return (
		<Panel header={panel_title}>
			<h1 style={{ margin: "0px" }}>
				<i className={`bi ${bootstrap_icon}`} /> {icon_title}
			</h1>
			{children}
		</Panel>
	);
};
