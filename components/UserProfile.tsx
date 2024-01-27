import { user } from "../types";

export const UserProfile = ({ user }: { user: user }) => {
	return (
		<div>
			<h1>UserProfile</h1>
			<p>{JSON.stringify(user)}</p>
		</div>
	);
};
