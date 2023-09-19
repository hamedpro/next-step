import React, { useContext } from "react";
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
	var active_profile_is_premium = cache
		.filter(
			(ci) =>
				ci.thing.type === "premium_subscription" &&
				ci.thing.value.user_id === active_profile_seed?.user_id
		)
		.map((ci) => ci.thing.value.end_timestamp)
		.some((end_timestamp) => new Date().getTime() < end_timestamp);
	var previous_subscriptions = cache.filter(
		(ci) =>
			ci.thing.type === "premium_subscription" &&
			ci.thing.value.user_id === active_profile_seed?.user_id
	);
	var active_user = cache.find((ci) => ci.thing_id === active_profile_seed?.user_id);
	return (
		<>
			<TopBar />
			<div style={{ padding: "12px" }}>
				<h1>User Feed</h1>
				{active_profile_is_premium ? (
					<p>You have an active premium plan.</p>
				) : (
					<Panel header="Upgrade">
						<div
							style={{ display: "flex", columnGap: "20px" }}
							className="flex-col sm:flex-row"
						>
							<div
								style={{ display: "flex" }}
								className="w-full flex-col sm:w-1/2"
							>
								<h1 style={{ margin: "0px" }}>
									<i className="bi bi-rocket-takeoff" /> Upgrade To Premium
								</h1>
								<p>
									You can show your support and enjoy our premium features by
									upgrading your account. you can also make your decision after
									your 2 week free trial.
								</p>
							</div>
							<div
								style={{ display: "flex" }}
								className="w-full flex-col sm:w-1/2"
							>
								<h3 style={{ margin: "0p" }}>Premium Features</h3>
								<ul>
									<li>Access To Premium Resources</li>
									<li>
										choose a primary roadmap and mark your progress. you can
										export a resume of your exact skills anytime you want.
									</li>
									<li>Access to Laboratories and polish your skills.</li>
									<li>
										Find A Work Partner and help each other grow. sometimes you
										need someone to push you out of laziness{" "}
									</li>
								</ul>
								<Button
									onClick={() => nav(`/payment-gateway`)}
									style={{ width: "100%" }}
								>
									Go Premium
								</Button>
							</div>
						</div>
					</Panel>
				)}
				<br />
				{previous_subscriptions.length === 0 && (
					<>
						<Panel header="Free Trial">
							<h1 style={{ margin: "0px" }}>
								<i className="bi bi-rocket-takeoff" /> 2 Week Free Trial
							</h1>
							<p>
								You meet the requirements to get a free trial. just by a single
								click.
							</p>
							<Button onClick={() => nav("/free-trial")}>Activate Trial</Button>
						</Panel>
						<br />
					</>
				)}

				<Panel header="Your Active Roadmap">
					<h1 style={{ margin: "0px" }}>
						<i className="bi bi-signpost-2" /> Your Active Roadmap
					</h1>
					{active_profile_is_premium ? (
						active_user?.thing.value.active_roadmap ? (
							<>
								<p>
									{
										cache.find(
											(ci) =>
												ci.thing_id ===
												active_user?.thing.value.active_roadmap
										)?.thing.value.title
									}
								</p>
								<Button
									onClick={() =>
										nav(`/${active_user?.thing.value.active_roadmap}`)
									}
								>
									Jump In
								</Button>
							</>
						) : (
							<p>
								You have not an active roadmap. mark a roadmap as your current in
								progress roadmap and that will be shown here
							</p>
						)
					) : (
						<p>
							You must be a premium subscriber to mark a roadmap as your active
							roadmap.
						</p>
					)}
				</Panel>
				<br />
				<Panel header="Some Random Roadmaps">
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
