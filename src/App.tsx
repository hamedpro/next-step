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
import { StepLabs } from "./components/StepLabs";
import { NewRoadmapCollection } from "./components/NewRoadmapCollection";
import { RoadmapCollections } from "./components/RoadmapCollections";
import { UniversalMap } from "./components/UniversalMap";
function App() {
	/* var freeflow_context = useContext(context);

	useEffect(() => {
		console.log(freeflow_context.cache);
	}, [freeflow_context.cache]); */

	return (
		<BrowserRouter>
			<UniversalMap>
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
						element={<StepLabs />}
						path="/:thing_id/labs"
					/>
					<Route
						element={<NewRoadmapCollection />}
						path="/roadmap_collections/new"
					/>
					<Route
						element={<RoadmapCollections />}
						path="/roadmap_collections"
					/>
				</Routes>
			</UniversalMap>
		</BrowserRouter>
	);
}

export default App;
