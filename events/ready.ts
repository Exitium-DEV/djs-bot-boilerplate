import { Client } from "../utilities/Client"

export default {
	once: true,															// OPTIONAL, defaults to false
	execute(client: Client) {											// REQUIRED, what should the event do?
		console.log(`[READY] Logged in as ${client.user?.tag}`);
	}
}