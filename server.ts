import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { node } from "./types";

var client = new MongoClient("mongodb://127.0.0.1:27017");
var db = client.db("next-step");

const typeDefs = `#graphql
  type node {
    title: String
    description: String
    weight: Int
    assets: [String]
    prerequisites: [String]
    parent: String
    _id: String
  }

  type Mutation {
    addNode(
      title: String!
      description: String
      weight: Int
      assets: [String]
      prerequisites: [String]
      parent: String
    ): node!
  }

  type Query {
    nodes: [node]
  }
`;

const resolvers = {
	Query: {
		nodes: async () =>
			(await db.collection("nodes").find().toArray()).map((doc) => ({
				...doc,
				_id: doc._id,
			})),
	},
	Mutation: {
		addNode: async (
			_: any,
			{
				title,
				description,
				weight,
				assets,
				prerequisites,
				parent,
			}: {
				title: string;
				description?: string;
				weight?: number;
				assets?: string[];
				prerequisites?: string[];
				parent?: string;
			}
		) => {
			try {
				var new_node: Omit<node, "_id"> = {
					title,
					description: description || "",
					weight: weight || 1,
					assets: assets || [],
					prerequisites: prerequisites || [],
					parent: parent,
				};

				const result = await db.collection("nodes").insertOne(new_node);
				return {
					_id: result.insertedId,
					...new_node,
				};
			} catch (error) {
				throw new Error("Failed to add node");
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(` Server listening at: ${url}`);
