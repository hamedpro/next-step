import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./components/Auth";
import { Root } from "./components/Root";
/* import { RoadMaps } from "./components/RoadMaps";
import { NewRoadMap } from "./components/NewRoadMap";
import { Root } from "./components/Root";
import { ThingRoute } from "./components/ThingRoute";
import { StepLabs } from "./components/StepLabs";
import { NewRoadmapCollection } from "./components/NewRoadmapCollection";
import { RoadmapCollections } from "./components/RoadmapCollections";
import { UniversalMap } from "./components/UniversalMap"; */
export function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					element={<Root />}
					path="/"
				/>
				<Route
					path="/auth"
					element={<Auth />}
				/>

				{/* 

				

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
					/> */}
			</Routes>
		</BrowserRouter>
	);
}
