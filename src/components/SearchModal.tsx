import React, { Fragment, useContext, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { context } from "freeflow-react";
import { CustomCard } from "./CustomCard";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
export const SearchModal = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
	var { cache } = useContext(context);
	var [search_query, set_search_query] = useState("");
	var search_results =
		search_query === "" ? [] : cache.filter((ci) => JSON.stringify(ci).includes(search_query));
	var nav = useNavigate();
	return (
		<Sidebar
			visible={visible}
			position="top"
			onHide={onHide}
			style={{ height: "75vh", borderRadius: "0px 0px 10px 10px" }}
		>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h1>Search</h1>
				<b>found {search_results.length} results</b>
			</div>
			<InputText
				style={{ width: "100%" }}
				onChange={(e) => set_search_query(e.target.value)}
				value={search_query}
			/>
			<div style={{ paddingTop: "15px" }}>
				{search_query === ""
					? "Start Typing..."
					: search_results
							.filter((ci) => ["step", "roadmap", "user"].includes(ci.thing.type))
							.map((ci, index, array) => (
								<Fragment key={JSON.stringify(ci)}>
									<CustomCard>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<b>{ci.thing_id}</b>
											<b>{ci.thing.type}</b>
											<b>
												{ci.thing.value.email_address ||
													ci.thing.value.title}
											</b>
											<Button onClick={() => nav(`/` + ci.thing_id)}>
												Jump In
											</Button>
										</div>
									</CustomCard>
									{index !== array.length - 1 && <hr />}
								</Fragment>
							))}
			</div>
		</Sidebar>
	);
};
