import { useCollection } from "./useCollection";
import { node, user } from "../types";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { useState } from "react";
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function useCharacterStatus() {
	var [current_parent_id, set_current_parent_id] = useState<node["parent"]>(null);
	var { data: nodes } = useCollection<node>("nodes");
	var { data: users } = useCollection<user>("users");
	if (nodes === undefined) return "i dont have nodes yet :(";
	var current_parent_node = nodes?.find((node) => node.id === current_parent_id);
	if (current_parent_id !== null && current_parent_id === undefined)
		return "current_parent_id is not null but i could not find the node in loaded nodes";
	if (users === undefined) return "users collection is not loaded yet";
	var user = users?.find((user) => user.id === localStorage.getItem("user_id"));
	if (user === undefined)
		return "users collection is loaded but there is no user with id = id you have in your localStorage (if you have !)";
	var children: node[] = nodes.filter((node) => node.parent === current_parent_id);
	return { children, set_current_parent_id, current_parent_node, user };
}
