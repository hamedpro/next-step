import React from "react";

export const GradientWallpaper = ({
	starting_color = "#0700b8",
	ending_color = "#00ff88",
}: {
	starting_color?: string;
	ending_color?: string;
}) => {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				background: `linear-gradient(90deg, ${starting_color} 0%, ${ending_color} 100%)`,
				zIndex: -1,
			}}
		/>
	);
};
