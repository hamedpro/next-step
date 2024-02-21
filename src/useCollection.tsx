import axios from "axios";
import { useEffect, useRef, useState } from "react";
export var api_endpoint: string = "http://localhost:4000";
export var custom_axios = axios.create({
	baseURL: api_endpoint,
});
export function useCollection<ItemType>(collection_name: string) {
	//when data is not undefined its guaranteed to be ItemType[]
	//undefined is when there is an error or loading or initial state
	var [data, set_data] = useState<undefined | ItemType[]>(undefined);
	var data_ref = useRef(data);
	var set_data_ref = useRef(set_data);
	set_data_ref.current = set_data;
	async function get_data() {
		custom_axios({
			url: `/collections/${collection_name}`,
		}).then(
			(response) => {
				if (JSON.stringify(response.data) !== JSON.stringify(data_ref.current)) {
					set_data_ref.current(response.data);
				}
			},
			(error) => {
				set_data_ref.current(undefined);
			}
		);
	}
	useEffect(() => {
		get_data();
	}, []);
	return { data, get_data };
}
