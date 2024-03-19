export interface asset {
	title: string;
	description: string;
	file_id: string;
}
export interface node {
	title: string;
	description: string;
	weight: number;
	assets: number[]; // asset_ids
	prerequisites: string[];
	parent: string | null;
	id: string;
}
export interface user {
	username: string;
	exam_records: {
		node_id: string;
		score: number /* out of 100 */;
		time: number /* new Date().getTime() */;
	}[];
	id: string;
	goal_timing_mode?:
		| [type: "dynamic", steps_each_day: number]
		| [type: "static", last_day: number /* timestamp of start of the last day */]
		| null;
	goal?: [node_id: string, skill_level: number /* out of 5 */][] | null;
	phone_number: string /* 09123456789 */;
	biography: string;
}
export type step = [node_id: string, current_skill_level: number, goal_skill_level: number];
