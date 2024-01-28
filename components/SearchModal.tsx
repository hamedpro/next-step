import { Fragment, useContext, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { CustomCard } from "./CustomCard";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { store_standard_type } from "react_stream/dist/utils";
export const SearchModal = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
	var { data } = useContext(ServerSyncContext);
	var [search_query, set_search_query] = useState("");
	var search_types = ["roadmaps", "users", "steps", "roadmap_collections", "labs"];
	var search_results: store_standard_type =
		search_query === ""
			? []
			: search_types
					.map((search_type) => {
						return data
							.filter(([id, type, value]) => type === search_type)
							.filter(([id, type, value]) =>
								JSON.stringify(value).includes(search_query)
							);
					})
					.flat();
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
				<h1>Search in {search_types.join(",")}</h1>
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
					: search_results.map((search_result, index, array) => (
							<Fragment key={JSON.stringify(search_result)}>
								<CustomCard>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<b>{search_result[1]}</b>
										<b>{JSON.stringify(search_result[2])}</b>
										<Button onClick={() => nav(`/` + search_result[0])}>
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
