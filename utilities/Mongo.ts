import { MongoClient as _MongoClient } from "mongodb";

const MongoClient = new _MongoClient(process.env.MONGO_URI ?? "mongodb://localhost:27017")

export default function init() {
	if (!process.env.MONGO_DB) throw new Error("MONGO_DB environment variable is not defined");
	return MongoClient.db(process.env.MONGO_DB);
};