import { useContext } from "react";
import { TopBar } from "./TopBar";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { context } from "freeflow-react";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { shuffle } from "../helpers";
export const UserFeed = () => {
	var { cache, profiles_seed } = useContext(context);
	var nav = useNavigate();
	var active_profile_seed = find_active_profile_seed(profiles_seed);

	var active_user = cache.find((ci) => ci.thing_id === active_profile_seed?.user_id);
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
					{active_user?.thing.value.active_roadmap ? (
						<>
							<p>
								{
									cache.find(
										(ci) =>
											ci.thing_id === active_user?.thing.value.active_roadmap
									)?.thing.value.title
								}
							</p>
							<Button
								onClick={() => nav(`/${active_user?.thing.value.active_roadmap}`)}
							>
								Jump In
							</Button>
						</>
					) : (
						<p>
							You have not an active roadmap. mark a roadmap as your current in
							progress roadmap and that will be shown here
						</p>
					)}
				</Panel>
				<br />
				<Panel header="5 Random Roadmaps">
					<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
						{shuffle(cache.filter((ci) => ci.thing.type === "roadmap"))
							.slice(0, 5)
							.map((ci) => (
								<Button
									key={JSON.stringify(ci)}
									onClick={() => nav(`/${ci.thing_id}`)}
								>
									{ci.thing.value.title}
								</Button>
							))}
					</div>

					<br />
					<Link to={`/roadmaps`}>
						See all {cache.filter((ci) => ci.thing.type === "roadmap").length} Roadmaps
					</Link>
				</Panel>
			</div>
		</>
	);
};
