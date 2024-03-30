import type { Client } from "../utilities/Client";

// This function will be called when the module is loaded, the name of the function does not matter. It must be async.
export default async function ExampleModule(client: Client) {
	console.log("... do something asynchronously");
}