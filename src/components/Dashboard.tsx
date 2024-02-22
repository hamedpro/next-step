import { Link } from "react-router-dom"
import { Nodes } from "./Nodes"
import { Panel } from "primereact/panel"
import { CharacterStatus } from "./CharacterStatus"
import { CustomPanel } from "./CustomPanel"

export const Dashboard = () => {
	return (
		<>
			<h1>Dashboard</h1>
			<Link to="/universal_map">Universal Map</Link>
			<Nodes />
			<hr />
			<h1>Now</h1>
			<CharacterStatus />
		</>
	)
}
