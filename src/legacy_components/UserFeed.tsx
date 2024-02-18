import { useContext } from "react";
import { TopBar } from "../components/TopBar";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { shuffle } from "../../helpers";
import { ServerSyncContext } from "react_stream/dist/ServerSyncContext";
import { roadmap, user } from "../../types";
export const UserFeed = () => {
	var { data, parsed_virtual_localstorage } = useContext(ServerSyncContext);
	var nav = useNavigate();
	console.log(parsed_virtual_localstorage.active_username);
	var active_user = data.find(
		([id, type, value]) =>
			type === "user" && value.username === parsed_virtual_localstorage.active_username
	) as [number, "user", user] | undefined;
	if (active_user === undefined) {
		return "active user not found";
	}

	return (
		<>
			<TopBar />
			<div style={{ padding: "12px" }}>
				<h1>User Feed</h1>
				<br />

				<Panel header="Your Active Roadmap">
					<h1 style={{ margin: "0px" }}>
						<i className="bi bi-signpost-2" /> Your Active Roadmap
					</h1>
					{active_user[2].active_roadmap ? (
						<>
							<p>
								{
									data.find(
										([id, type, value]) =>
											active_user![2].active_roadmap === id &&
											type === "roadmap"
									)?.[2].title
								}
							</p>
							<Button onClick={() => nav(`/${active_user![2].active_roadmap}`)}>
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
						{shuffle(
							data.filter(([id, type, value]) => type === "roadmap") as [
								number,
								"roadmap",
								roadmap
							][]
						)
							.slice(0, 5)
							.map(([id, type, value]) => (
								<Button
									key={JSON.stringify([id, type, value])}
									onClick={() => nav(`/${id}`)}
								>
									{value.title}
								</Button>
							))}
					</div>

					<br />
					<Link to={`/roadmaps`}>
						See all {data.filter(([id, type, value]) => type === "roadmap").length}{" "}
						Roadmaps
					</Link>
				</Panel>
			</div>
		</>
	);
};
