import React, { useContext } from "react";
import { CustomTitle } from "./CustomTitle";
import { context } from "freeflow-react";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Panel } from "primereact/panel";

export const FreeTrial = () => {
	var nav = useNavigate();
	var { cache, profiles_seed, request_new_thing } = useContext(context);
	var active_profile_seed = find_active_profile_seed(profiles_seed);
	var previous_subscriptions = cache.filter(
		(ci) =>
			ci.thing.type === "premium_subscription" &&
			ci.thing.value.user_id === active_profile_seed?.user_id
	);
	async function start_free_trial() {
		if (active_profile_seed?.user_id === undefined || active_profile_seed?.user_id === 0) {
			alert(
				"thre's not any active profile seed to use or the active one is anonymous profile seed."
			);
			return;
		}
		await request_new_thing({
			thing: {
				type: "premium_subscription",
				value: {
					user_id: active_profile_seed.user_id,
					start_timestamp: new Date().getTime(),
					end_timestamp: new Date().getTime() + 14 * 24 * 3600 * 1000,
				},
			},
		});
		alert("your premium subscription was activated successfully.");
		nav("/");
	}
	return (
		<div style={{ padding: "12px" }}>
			<CustomTitle
				back_link="/"
				text="Free Trial"
			/>
			{previous_subscriptions.length === 0 ? (
				<>
					<Panel header="Free Trial">
						<h1 style={{ margin: "0px" }}>
							<i className="bi bi-rocket-takeoff" /> 2 Week Free Trial
						</h1>
						<p>
							You meet the requirements to get a free trial. upgrade just by a single
							click.
						</p>
						<Button onClick={start_free_trial}>Activate Trial</Button>
					</Panel>
					<br />
				</>
			) : (
				<p>
					You don't meet the requirements of activating a free trial. you have logged into
					a virtual profile or you have a previous premium subscription.
				</p>
			)}
		</div>
	);
};
