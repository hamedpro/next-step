import React from "react";
import wallpaper from "/Users/hamedpro/wallpapers/35594.jpg";
export const AuthRoutesTemplate = ({
	icon_url,
	children,
}: {
	icon_url: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				backgroundImage: `url(${wallpaper})`,
				width: "100%",
			}}
		>
			<div
				style={{
					width: "40%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					gap: "36px",
					padding: "40px 36px",
					backgroundColor: "var(--color1_secondary)",
				}}
			>
				<div style={{}}>
					<img
						src={icon_url}
						style={{ width: "100%" }}
					/>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};
