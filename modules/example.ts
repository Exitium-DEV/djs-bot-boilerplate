import type { Client } from "../utilities/Client";

// MUST BE ASYNC FUNCTION
export default async function ExampleModule(client: Client) {
	console.log("... do something asynchronously");
}