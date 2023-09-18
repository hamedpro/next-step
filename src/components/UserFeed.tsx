import React from "react";
import { TopBar } from "./TopBar";

export const UserFeed = () => {
	return (
		<>
			<TopBar />
			<div style={{ padding: "8px" }}>
				<h1>User Feed</h1>
				<p>this page shows you what you need to know</p>
			</div>
		</>
	);
};
