import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient, ObjectId } from "mongodb";
import { node } from "./types";
import express from "express";
import formidable from "formidable";
import cors from "cors";
import { custom_sha256_hash } from "./helpers";
import { existsSync, mkdir, mkdirSync, readdirSync, renameSync } from "fs";
import { homedir } from "os";
import path from "path";
var client = new MongoClient("mongodb://127.0.0.1:27017");
var db = client.db("next-step");

var app = express();
app.use(
	cors({
		optionsSuccessStatus: 200, // Some legacy browsers choke on 204
		exposedHeaders: ["Content-Disposition"],
	})
);
app.use(express.json());

app.get(
	`/collections/:collection_name`,
	async (request: express.Request, response: express.Response) => {
		try {
			var data = (await db.collection(request.params.collection_name).find().toArray()).map(
				(doc) => ({ ...doc, _id: undefined, id: doc._id })
			);
			if ("hash" in request.query) {
				response.json(custom_sha256_hash(data));
			} else {
				response.json(data);
			}
		} catch (error) {
			response.status(400).json(error);
		}
	}
);
app.put(
	`/collections/:collection_name/:id`,
	async (request: express.Request, response: express.Response) => {
		try {
			var patch = request.body;
			await db
				.collection(request.params.collection_name)
				.updateOne({ _id: new ObjectId(request.params.id) }, { $set: patch });
			response.json();
		} catch (error) {
			console.log("error", error);
			response.status(400).json(error);
		}
	}
);
app.post(
	"/collections/:collection_name",
	async (request: express.Request, response: express.Response) => {
		try {
			var { value } = request.body;
			var { insertedId } = await db
				.collection(request.params.collection_name)
				.insertOne(value);
			response.json(insertedId);
		} catch (error) {
			console.log("error", error);
			response.status(400).json(error);
		}
	}
);
function createDirectoryIfNotExists(path: string) {
	const exists = existsSync(path);
	if (!exists) {
		mkdirSync(path);
	}
}
var uploads_dir_abs_path = `${homedir()}/next_step_uploads`;
createDirectoryIfNotExists(uploads_dir_abs_path);

app.post("/files", async (request: express.Request, response: express.Response) => {
	try {
		var { new_file_id, file_mime_type, originalFilename } = await new Promise<{
			file_mime_type: string;
			new_file_id: number;
			originalFilename: string;
		}>((resolve, reject) => {
			var f = formidable({
				uploadDir: path.resolve(uploads_dir_abs_path),
			});
			f.parse(request, (err, fields, files) => {
				if (err) {
					reject(err);
					return;
				}
				if (!files["file"]) {
					reject("files['file'] is falsy");
					return;
				}
				var file = files["file"][0];
				var new_file_id = readdirSync(uploads_dir_abs_path).length + 1;
				var new_file_path = path.resolve(
					uploads_dir_abs_path,
					`${new_file_id}-${file.originalFilename}`
				);

				renameSync(file.filepath, new_file_path);

				resolve({
					new_file_id,
					file_mime_type: file.mimetype || "unknown",
					originalFilename: file.originalFilename || "unknown",
				});
				return;
			});
		});

		response.json({ new_file_id });
	} catch (error) {
		console.error(error);
		response.status(500).json({ message: "Error uploading file!" });
	}
});
app.get("/files/:file_id", (request: express.Request, response: express.Response) => {
	var { file_id } = request.params;
	var filenames = readdirSync(uploads_dir_abs_path);
	var filename = filenames.find((filename) => filename.startsWith(file_id));
	if (filename === undefined) {
		response.status(404).json(`there is no file with id = ${file_id}`);
		return;
	}
	response.download(path.join(uploads_dir_abs_path, filename));
});
app.listen(4000);
