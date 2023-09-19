//this is a fake paymeny gateway
//to simulate it until we have got one
import React, { useContext, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { context } from "freeflow-react";
import { find_active_profile_seed } from "freeflow-core/dist/utils";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";

export const FakePG = () => {
	var nav = useNavigate();
	var [success_dialog, set_success_dialog] = useState(false);
	var { request_new_thing, profiles_seed } = useContext(context);
	var active_profile_seed = find_active_profile_seed(profiles_seed);
	async function submit_new_subscription() {
		if (active_profile_seed === undefined) {
			alert("there is not any active profile to activate a premium subscription");
			return;
		} else if (active_profile_seed.user_id === 0) {
			alert("you are logged in as anonymous. login as a particular user");
			return;
		}
		await request_new_thing({
			thing: {
				type: "premium_subscription",
				value: {
					user_id: active_profile_seed.user_id,
					start_timestamp: new Date().getTime(),
					end_timestamp: new Date().getTime() + 31 * 1000 * 24 * 3600,
				},
			},
			thing_privileges: { read: "*", write: "*" },
		});
		set_success_dialog(true);
	}
	return (
		<>
			<Dialog
				onHide={() => set_success_dialog(false)}
				visible={success_dialog}
				header="Success"
			>
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<p>Your subscription is activated successfully.</p>
					<Button onClick={() => nav("/")}>Get Back To Feed</Button>
				</div>
			</Dialog>

			<CustomTitle
				back_link="/"
				text="Payment Gateway"
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<h1>Congratulation!</h1>
				<p>
					we're in Beta phase and we dont have an active Payment Gateway yet. your
					Subscription will be activated with no cost! enjoy your premium Subscription and
					report if you ever found a bug.
				</p>
				<Button onClick={submit_new_subscription}>
					Go Premium <i className="bi bi-rocket-takeoff" />{" "}
				</Button>
			</div>
		</>
	);
};
