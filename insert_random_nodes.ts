import { MongoClient } from "mongodb";
import { node } from "./types";
import { shuffle } from "./helpers";
import { readFileSync } from "fs";

var client = new MongoClient("mongodb://127.0.0.1:27017");

var db = client.db("next-step");

export function choose<T>(choices: T[]): T {
	if (choices.length === 0) {
		throw new Error("there is not any item to choose");
	}
	var clone: any[] = JSON.parse(JSON.stringify(choices));
	shuffle(clone);
	return clone[0];
}
export function generateRandomString(length: number): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	return Array.from(
		{ length },
		() => characters[Math.floor(Math.random() * characters.length)]
	).join("");
}
export function intrange(n: number): number[] {
	var range: number[] = [];
	for (var i = 1; i <= n; i++) {
		range.push(i);
	}
	return range;
}
export function choose_multiple_random_items(choices: any[], count: number) {
	var clone: any[] = JSON.parse(JSON.stringify(choices));
	shuffle(clone);
	return clone.slice(0, count);
}
var new_created_nodes_count = 0;
var random_english_words: string[] = JSON.parse(
	readFileSync("./random_english_words.json", "utf8")
);
function random_english_word() {
	return choose(random_english_words);
}
async function insert_random_node(
	parent: string | undefined,
	depth: number,
	drop_table_first: boolean = false
) {
	if (drop_table_first) await db.collection("nodes").deleteMany({});

	if (depth === 0) return;

	var new_node: Omit<node, "_id"> = {
		title: random_english_word(),
		description: intrange(20)
			.map((_) => random_english_word())
			.join(" "),
		weight: choose([1, 2, 3, 4, 5]),
		prerequisites: choose_multiple_random_items(
			(await db.collection("nodes").find({}).toArray()).map(({ _id }) => _id.toString()),
			choose([1, 2, 3])
		),
		parent: parent,
		assets: [],
	};

	console.log("going to insert this", JSON.stringify(new_node));
	var { insertedId } = await db.collection("nodes").insertOne(new_node);
	console.log({ insertedId });
	new_created_nodes_count++;

	var children_count = choose([3, 4, 5]);

	for (var i = 0; i < children_count; i++) {
		await insert_random_node(insertedId.toString(), depth - 1);
	}
}
await insert_random_node(undefined, 3, true);
client.close();
console.log(new_created_nodes_count);
