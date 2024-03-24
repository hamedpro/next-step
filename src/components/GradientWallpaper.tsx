import React from "react";

export const GradientWallpaper = () => {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				background: "linear-gradient(90deg, #0700b8 0%, #00ff88 100%)",
				zIndex: -1,
			}}
		/>
	);
};
