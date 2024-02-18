import { Link } from "react-router-dom";
import { Nodes } from "./Nodes";

export const Dashboard = () => {
	return (
		<>
			<h1>Dashboard</h1>
			<Link to="/universal_map">Universal Map</Link>
			<Nodes />
		</>
	);
};
