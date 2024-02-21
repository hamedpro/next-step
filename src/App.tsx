import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
/* import { Auth } from "./components/Auth";
import { Root } from "./components/Root";
import { RoadMaps } from "./components/RoadMaps";
import { ThingRoute } from "./components/ThingRoute";
import { NewRoadMap } from "./components/NewRoadMap";
import { StepLabs } from "./components/StepLabs";
import { NewRoadmapCollection } from "./components/NewRoadmapCollection";
import { RoadmapCollections } from "./components/RoadmapCollections"; */
import { Dashboard } from "./components/Dashboard";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { UniversalMap } from "./components/UniversalMap";
import { Root } from "./components/Root";
import { Node } from "./components/Node";
var client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: "http://localhost:4000",
});
export function App() {
	return (
		<>
			<ApolloProvider client={client}>
				<BrowserRouter>
					<Routes>
						<Route
							path="/dashboard"
							element={<Dashboard />}
						/>
						<Route
							path="/universal_map"
							element={<UniversalMap />}
						/>
						<Route
							element={<Root />}
							path="/"
						/>
						<Route
							path="/nodes/:node_id"
							element={<Node />}
						/>

						{/*
					<Route
						path="/auth"
						element={<Auth />}
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
					/> */}
					</Routes>
				</BrowserRouter>
			</ApolloProvider>
		</>
	);
}
