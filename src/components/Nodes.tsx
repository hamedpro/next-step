import { gql, useQuery } from "@apollo/client";
import React, { Fragment, useState } from "react";
import { CustomTitle } from "./CustomTitle";
import { Button } from "primereact/button";
import { node } from "../../types";
import { Link } from "react-router-dom";
import { NewNodeModal } from "./NewNodeModal";

export const Nodes = () => {
	var { data, loading, error } = useQuery(gql`
		query get_nodes {
			nodes {
				_id
				title
			}
		}
	`);

	var [new_node_modal, set_new_node_modal] = useState(false);
	if (loading) return "loading...";
	var nodes: Pick<node, "_id" | "title">[] = data.nodes;
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
				<Fragment key={node._id}>
					<Link to={`/nodes/${node._id}`}>{node.title}</Link>
					<br />
				</Fragment>
			))}
		</>
	);
};
