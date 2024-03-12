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
	password: string;
	exam_records: {
		node_id: string;
		score: number /* out of 100 */;
		time: number /* new Date().getTime() */;
	}[];
	id: string;
	goal_timing_mode?:
		| [type: "dynamic", steps_each_day: number]
		| [type: "static", finish_timestamp: ReturnType<(typeof Date)["now"]>]
		| null;
	goal?: [node_id: string, skill_level: number /* out of 5 */][] | null;
}
