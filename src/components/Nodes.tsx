import { gql, useQuery } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { node } from "../../types";
import { Link } from "react-router-dom";
import { NewNodeModal } from "./NewNodeModal";
import { useCollection } from "../useCollection";

export const Nodes = () => {
	var { data: nodes, get_data } = useCollection<node>("nodes");

	var [new_node_modal, set_new_node_modal] = useState(false);

	if (nodes === undefined) return "data not available";
	return (
		<>
			<NewNodeModal
				onHide={() => set_new_node_modal(false)}
				active={new_node_modal}
			/>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h1>Nodes</h1>
				<Button onClick={() => set_new_node_modal(true)}>New Node</Button>
			</div>
			{nodes.map((node) => (
				<Fragment key={node.id}>
					<Link to={`/nodes/${node.id}`}>{node.title}</Link>
					<br />
				</Fragment>
			))}
			<button onClick={() => get_data()}>refetch nodes </button>
		</>
	);
};
