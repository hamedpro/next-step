import axios from "axios";
import { useEffect, useRef, useState } from "react";
export var api_endpoint: string = "http://localhost:9000";
export var custom_axios = axios.create({
	baseURL: api_endpoint,
});
export function useCollection<ItemType>(collection_name: string) {
	//when data is not undefined its guaranteed to be ItemType[]
	//undefined is when there is an error or loading or initial state
	var [data, set_data] = useState<undefined | ItemType[]>(undefined);

	async function get_data() {
		custom_axios({
			url: `/collections/${collection_name}`,
		}).then(
			(response) => {
				set_data(response.data);
			},
			(error) => {
				set_data(undefined);
			}
		);
	}
	useEffect(() => {
		get_data();
	}, []);

	return { data, get_data };
}
