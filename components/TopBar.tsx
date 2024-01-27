import { calc_file_url, find_active_profile_seed } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { Button } from "primereact/button";
import React, { useContext, useState } from "react";
import { SearchModal } from "./SearchModal";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./SideBar";
import { InputText } from "primereact/inputtext";

export const TopBar = () => {
	var { profiles_seed, cache, rest_endpoint } = useContext(context);
	var active_user_id = find_active_profile_seed(profiles_seed)?.user_id;
	var active_user = cache.find((ci) => ci.thing_id === active_user_id);
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
					{(active_user_id || 0) === 0 ? (
						<Button
							onClick={() => nav(`/login`)}
							style={{
								height: "45px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							Login
						</Button>
					) : active_user?.thing.value.profile_image_file_id ? (
						<img
							style={{ width: "45px", height: "45px" }}
							src={calc_file_url(
								profiles_seed,
								rest_endpoint,
								active_user?.thing.value.profile_image_file_id
							)}
						/>
					) : active_user_id === -1 ? (
						<i
							onClick={() =>
								alert(
									`your active profile is system profile. its a virtual profile.`
								)
							}
							style={{ fontSize: "45px" }}
							className={`bi bi-person-gear`}
						/>
					) : (
						<i
							onClick={() => {
								nav(`/${active_user_id}`);
							}}
							style={{ fontSize: "45px" }}
							className={`bi bi-person-fill`}
						/>
					)}
				</div>
			</div>
		</>
	);
};
