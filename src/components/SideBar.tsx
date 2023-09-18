import React from "react";
import { Sidebar } from "primereact/sidebar";
export const SideBar = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
	return (
		<Sidebar
			visible={visible}
			onHide={onHide}
			position="left"
		>
			<h1>welcome to Next Step!</h1>
		</Sidebar>
	);
};
