import React from "react";
import { Card } from "primereact/card";
export const CustomCard = ({ children }: { children: React.ReactNode }) => {
	return (
		<Card
			style={{ padding: "0px" }}
			pt={{ content: { style: { padding: "0px" } } }}
		>
			{children}
		</Card>
	);
};
