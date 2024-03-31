import type { Client } from "../utilities/Client";

export type InteractionClientOverride<T> = Omit<T, "client"> & { client: Client };