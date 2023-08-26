export type env = {
	api_port: number;
	ui_port: number;
};
export type roadmap = {
	title: string;
	description: string;
	weight: number;
	id: number;
};
export type store = {
	roadmaps: roadmap[];
};
