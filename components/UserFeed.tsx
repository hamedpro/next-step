import { useContext } from "react";
//import { TopBar } from "./TopBar";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { shuffle } from "../helpers";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { roadmap, user } from "../types";
export const UserFeed = () => {
	var { data, parsed_virtual_localstorage } = useContext(ServerSyncContext);
	var nav = useNavigate();
	var active_user = data.users.find(
		(u: user) => u.username === parsed_virtual_localstorage.active_username
	) as user;
	if (!active_user) {
		return "active user not found";
	}

	return (
		<>
			{/* <TopBar /> */}
			<div style={{ padding: "12px" }}>
				<h1>User Feed</h1>
				<br />

				<Panel header="Your Active Roadmap">
					<h1 style={{ margin: "0px" }}>
						<i className="bi bi-signpost-2" /> Your Active Roadmap
					</h1>
					{active_user.active_roadmap ? (
						<>
							<p>
								{
									data.roadmaps.find(
										(roadmap: roadmap) =>
											roadmap.id === active_user.active_roadmap
									)?.title
								}
							</p>
							<Button onClick={() => nav(`/${active_user.active_roadmap}`)}>
								Jump In
							</Button>
						</>
					) : (
						<p>
							you dont have an active roadmap. mark a roadmap as your current in
							progress roadmap and that will be shown here
						</p>
					)}
				</Panel>
				<br />
				<Panel header="5 Random Roadmaps">
					<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
						{shuffle(data.roadmaps)
							.slice(0, 5)
							.map((roadmap) => (
								<Button
									key={JSON.stringify(roadmap)}
									onClick={() => nav(`/${roadmap.id}`)}
								>
									{roadmap.title}
								</Button>
							))}
					</div>

					<br />
					<Link to={`/roadmaps`}>See all {data.roadmaps.length} Roadmaps</Link>
				</Panel>
			</div>
		</>
	);
};
