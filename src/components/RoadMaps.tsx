import { useContext, useEffect, useState } from "react";
import { api_context } from "../api_context";
import { Panel } from "primereact/panel";
import { roadmap } from "../../types";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
export const RoadMaps = () => {
	var nav = useNavigate();
	var { custom_axios } = useContext(api_context);
	var [roadmaps, set_roadmaps] = useState<roadmap[] | undefined>();
	useEffect(() => {
		custom_axios({
			url: "/roadmaps",
		}).then(
			(response) => {
				set_roadmaps(response.data);
			},
			(error) => {
				console.log(error);
				alert("error in console");
			}
		);
	});
	if (roadmaps === undefined) return "loading...";
	return (
		<Panel title="RoadMaps">
			{roadmaps.map((roadmap) => (
				<Button key={roadmap.id} onClick={() => nav(`/roadmaps/${roadmap.id}`)}>
					{roadmap.title}
				</Button>
			))}
		</Panel>
	);
};
