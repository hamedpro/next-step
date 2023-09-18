import { calc_file_url, find_active_profile_seed } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { Button } from "primereact/button";
import React, { useContext, useState } from "react";
import { SearchModal } from "./SearchModal";
import { useNavigate } from "react-router-dom";
import { SideBar } from "./SideBar";

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
				<i
					onClick={() => set_sidebar(true)}
					className="bi bi-list"
					style={{ fontSize: "50px" }}
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
						onClick={() => {
							set_seach_modal(true);
						}}
						className="md:bg-gray-800 md:w-72"
						style={{
							display: "flex",
							alignItems: "center",
							padding: "10px",
							columnGap: "20px",
						}}
					>
						<i
							className="bi bi-search"
							style={{ fontSize: "40px" }}
						/>
						<h3 className="hidden md:block">Type Something...</h3>
					</div>

					{(active_user_id || 0) === 0 ? (
						<Button onClick={() => nav(`/login`)}>Login</Button>
					) : active_user?.thing.value.profile_image_file_id ? (
						<img
							style={{ width: "50px", height: "50px" }}
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
							style={{ fontSize: "50px" }}
							className={`bi bi-person-gear`}
						/>
					) : (
						<i
							onClick={() => {
								nav(`/${active_user_id}`);
							}}
							style={{ fontSize: "50px" }}
							className={`bi bi-person-fill`}
						/>
					)}
				</div>
			</div>
		</>
	);
};
