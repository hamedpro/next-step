import { env, store } from "./../types";
import express from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import path from "path";

var data_dir = path.join(homedir(), ".next-step-data");
var env_file = path.join(data_dir, "env.json");
var store_file = path.join(data_dir, "store.json");

mkdirSync(data_dir, { recursive: true });

if (existsSync(env_file) === false) {
	var default_env: env = { api_port: 3400, ui_port: 3500 };
	writeFileSync(env_file, JSON.stringify(default_env));
}
var env: env = JSON.parse(readFileSync(env_file, "utf-8"));

if (existsSync(store_file) === false) {
	var default_store: store = { roadmaps: [] };
	writeFileSync(store_file, JSON.stringify(default_store));
}
var store: store = JSON.parse(readFileSync(store_file, "utf-8"));

function modify_store(func: Function) {
	store = func(store);
	writeFileSync(store_file, JSON.stringify(store));
}
var app = express();
app.get("/roadmaps", (request, response) => {
	response.json(store.roadmaps);
});
app.listen(4000);
