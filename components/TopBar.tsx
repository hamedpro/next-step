import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { SearchModal } from "./SearchModal";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./SideBar";
import { InputText } from "primereact/inputtext";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { user } from "../types";

export const TopBar = () => {
	var { data, parsed_virtual_localstorage } = useContext(ServerSyncContext);
	var user = data.users.find(
		(u: user) => u.username === parsed_virtual_localstorage.active_username
	) as user;

	var [search_modal, set_seach_modal] = useState(false);
	var [sidebar, set_sidebar] = useState(false);
	var nav = useNavigate();
	return (
		<>
			<SearchModal
				onHide={() => set_seach_modal(false)}
				visible={search_modal}
			/>
			<SideBar
				onHide={() => set_sidebar(false)}
				visible={sidebar}
			/>
			<div
				style={{
					width: "100%",
					backgroundColor: "black",
					height: "100px",
					display: "flex",
					columnGap: "20px",
					alignItems: "center",
					padding: "0px 20px",
					justifyContent: "space-between",
				}}
			>
				<Button
					icon={"bi bi-list"}
					onClick={() => set_sidebar(true)}
					style={{ width: "45px", height: "45px" }}
				/>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						columnGap: "20px",
					}}
				>
					<div
						className="p-inputgroup sm:flex hidden"
						onClick={() => {
							set_seach_modal(true);
						}}
						style={{ height: "45px" }}
					>
						<InputText
							placeholder="Search Everywhere..."
							className="w-72"
						/>
						<Button
							icon="bi bi-search"
							className="p-button-success"
						/>
					</div>
					<Button
						style={{ height: "45px" }}
						onClick={() => {
							set_seach_modal(true);
						}}
						icon="bi bi-search"
						className="p-button-success sm:hidden"
					/>
					{
						<i
							onClick={() => {
								nav(`/${user.username}`);
							}}
							style={{ fontSize: "45px" }}
							className={`bi bi-person-fill`}
						/>
					}
				</div>
			</div>
		</>
	);
};
