import { Client } from "../utilities/Client";
import { type Event } from "../types/Event";

export default {
	once: true,															// OPTIONAL, defaults to false
	execute(client: Client) {											// REQUIRED, what should the event do?
		console.log(`[READY] Logged in as ${client.user?.tag}`);
	}
} satisfies Event;