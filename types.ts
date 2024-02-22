export interface asset {
	title: string
	description: string
	file_id: string
}
export interface node {
	title: string
	description: string
	weight: number
	assets: number[] // asset_ids
	prerequisites: string[]
	parent: string | null
	id: string
}
export interface user {
	username: string
	password: string
	skill_set: [node_id: string, value: number /* a float from 0 up to 5 */][]
	id: string
}
