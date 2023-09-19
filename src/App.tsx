import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./tailwind_output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoadMaps } from "./components/RoadMaps";
import { context } from "freeflow-react";
import { useContext, useEffect } from "react";
import { NewRoadMap } from "./components/NewRoadMap";
import { Root } from "./components/Root";
import { ThingRoute } from "./components/ThingRoute";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { UserFeed } from "./components/UserFeed";
import { FakePG } from "./components/FakePG";
import { FreeTrial } from "./components/FreeTrial";
function App() {
	var freeflow_context = useContext(context);
	useEffect(() => {
		freeflow_context.set_state((prev) => ({
			...prev,
			profiles_seed: [
				//here
				...prev.profiles_seed
					.filter((ps) => ps.user_id !== 0)
					.map((ps) => ({ ...ps, is_active: false })),
				{ user_id: 0, max_depth: undefined, is_active: true, jwt: undefined },
			],
		}));
	}, []);
	/* useEffect(() => {
		console.log(freeflow_context.cache);
	}, [freeflow_context.cache]);
	*/
	useEffect(() => {
		console.log(freeflow_context.profiles);
	}, [JSON.stringify(freeflow_context.profiles)]);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={<Root />}
					path="/"
				/>

				<Route
					element={<LoginPage />}
					path="/login"
				/>
				<Route
					element={<RegisterPage />}
					path="/register"
				/>

				<Route
					element={<RoadMaps />}
					path="/roadmaps"
				/>
				<Route
					element={<ThingRoute />}
					path="/:thing_id"
				/>

				<Route
					element={<NewRoadMap />}
					path="/roadmaps/new"
				/>
				<Route
					element={<FakePG />}
					path="/payment-gateway"
				/>
				<Route
					element={<FreeTrial />}
					path="/free-trial"
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
