export interface Event {
	once?: boolean;
	execute: (args?: any) => Promise<void> | void;
}