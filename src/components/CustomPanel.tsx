import { Panel } from "primereact/panel";
import React, { ReactNode } from "react";

export const CustomPanel = ({
	children,
	icon,
	panel_title,
	icon_title,
}: {
	children?: ReactNode;
	icon: string;
	panel_title: string;
	icon_title: string;
}) => {
	return (
		<Panel header={panel_title}>
			<h1 style={{ margin: "0px" }}>
				<i className={`bi ${icon}`} /> {icon_title}
			</h1>
			{children}
		</Panel>
	);
};
