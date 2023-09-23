import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { context } from "freeflow-react";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { active_profile_seed_is_premium } from "../helpers";

export const PremiumUpgradeBanner = () => {
	var { cache, profiles_seed } = useContext(context);
	var nav = useNavigate();
	var active_profile_seed = find_active_profile_seed(profiles_seed);
	var active_profile_is_premium = active_profile_seed_is_premium(cache, profiles_seed);

	return active_profile_is_premium ? (
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
						You can show your support and enjoy our premium features by upgrading your
						account. you can also make your decision after your 2 week free trial.
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
							choose a primary roadmap and mark your progress. you can export a resume
							of your exact skills anytime you want.
						</li>
						<li>Access to Laboratories and polish your skills.</li>
						<li>
							Find A Work Partner and help each other grow. sometimes you need someone
							to push you out of laziness{" "}
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
	);
};
