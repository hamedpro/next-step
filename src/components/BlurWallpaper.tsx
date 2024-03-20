import React from "react";

export const BlurWallpaper = ({ wallpaper }: { wallpaper: string }) => {
	return (
		<div
			style={{
				background: `url(${wallpaper})`,
				width: "100vw",
				height: "100vh",
				zIndex: -1,
				position: "fixed",
				filter: "blur(32px)",
			}}
		/>
	);
};
