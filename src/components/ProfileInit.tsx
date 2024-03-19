import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import at_gradient from "/Users/hamedpro/Downloads/3dicons-png-dynamic-1.0.0/png/at/at-dynamic-gradient.png";
import { AuthRoutesTemplate } from "./AuthRoutesTemplate";
import wallpaper from "/Users/hamedpro/wallpapers/35594.jpg";
import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import { InputText } from "primereact/inputtext";
import { custom_axios, useCollection } from "../useCollection";
import { user } from "../../types";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

export const ProfileInit = () => {
	var toast = useRef<Toast>(null);
	var [entered_biography, set_entered_biography] = useState<string>("");
	var [entered_username, set_entered_username] = useState<string>("");
	var nav = useNavigate();

	var { data: users, get_data: refresh_users } = useCollection<user>("users");
	var user = users?.find((user) => user.id === localStorage.getItem("user_id"));
	useLayoutEffect(() => {
		set_entered_username(user?.username || "");
	}, [user?.username]);
	useLayoutEffect(() => {
		set_entered_biography(user?.biography || "");
	}, [user?.biography]);
	if (users === undefined) return "'users' collection is not available";
	if (user === undefined) return "could not find your user data";
	var username_is_taken_by_another_one: boolean = users
		.filter((i) => i.id !== user!.id)
		.map((i) => i.username)
		.includes(entered_username);
	async function save_data() {
		await custom_axios({
			url: `/collections/users/${user!.id}`,
			method: "put",
			data: {
				username: entered_username,
				biography: entered_biography,
			},
		});
		toast.current?.show({
			severity: "success",
			detail: "Changes Applied Successfully. You Will Be navigated In 3 Seconds.",
		});
		setTimeout(() => {
			nav(`/dashboard`);
		}, 3000);
	}
	return (
		<>
			<Toast ref={toast} />
			<div
				style={{
					height: "100vh",
					display: "flex",
					backgroundImage: `url(${wallpaper})`,
					width: "100vw",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						width: "70%",

						display: "flex",
						justifyContent: "space-around",
						alignItems: "center",
						padding: "32px",
						backgroundColor: "var(--color1_secondary)",
						gap: "32px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
							width: "50%",
							padding: "8px",
						}}
					>
						<img
							src={at_gradient}
							style={{
								width: "60%",
								aspectRatio: "1",
								height: "max-content",
								marginBottom: "24px",
							}}
						/>
						<h1
							style={{
								margin: "12px 0px",
								color: "var(--color1_primary)",
							}}
						>
							Missing Profile Credentials
						</h1>
						<p style={{ margin: "0", color: "var(--color1_primary)" }}>
							Your authentication was done. now feel free to complete your profile
						</p>
					</div>
					<div style={{ width: "50%", height: "100%" }}>
						<h3 style={{ color: "var(--color1_primary)", margin: "12px 0px" }}>
							Username:
						</h3>
						<span
							className="p-input-icon-right"
							style={{ width: "100%" }}
						>
							<i
								className={`
							pi
							${username_is_taken_by_another_one ? "pi-exclamation-triangle" : "pi-check"}
							`}
							/>
							<InputText
								style={{ width: "100%" }}
								onChange={(e) => set_entered_username(e.target.value)}
								value={entered_username}
							/>
						</span>
						{username_is_taken_by_another_one && <span>Username Is Taken</span>}
						<h3 style={{ color: "var(--color1_primary)", margin: "12px 0px" }}>
							Biography:{" "}
						</h3>
						<InputTextarea
							style={{ width: "100%" }}
							value={entered_biography}
							onChange={(e) => set_entered_biography(e.target.value)}
							rows={7}
						/>
						<Button
							style={{ width: "100%", marginTop: "16px" }}
							onClick={save_data}
						>
							Done
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
